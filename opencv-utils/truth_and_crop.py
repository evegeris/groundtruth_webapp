import cv2 # tested with opencv version 3.1.0, as low as 2.4.0 should work
import numpy as np
import argparse
import matplotlib.pyplot as plt
from skimage.segmentation import slic
from skimage.segmentation import mark_boundaries

# constants
PX_INTENSITY = 0.3
N_CHANNELS = 2

# globals
drawing = False # true if mouse is pressed
cropping = False # if True, draw rectangle. Press 'm' to toggle to curve
ix,iy = -1,-1
w=0

crop_list=[]
class_label = 0 #0 for other, 1 for mussel, 2 for tunicate
drawing_list=[]

def color_superpixel_by_class(x,y,class_label):
    """Color superpixel according to class_label

    Keyword arguments:
    x,y -- pixel coordinates from MouseCallback
    class_label -- determines channel (B,G,R) whose intensity to set
    """
    global segments
    img[:,:,N_CHANNELS-class_label][segments==segments[y,x]]=PX_INTENSITY

def handle_mouse_events(event,x,y,flags,param):
    """Perform ground truthing, and select areas to crop via MouseCallback

    Keyword arguments:
    event -- mouse event type, (e.g moving, left/right click)
    x,y -- current mouse coordinates
    """
    global w,drawing,cropping

    if event == cv2.EVENT_LBUTTONDOWN:
        # if we are cropping, we are not truthing
        if cropping == True:
            drawing = False
            cv2.rectangle(img,(x-w,y-w),(x+w,y+w),(0,255,0),3)
            crop_list.append((x,y))
        
        # we are ground truthing
        else:
            drawing = True
            drawing_list.append((x,y,class_label))
            color_superpixel_by_class(x,y,class_label)

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing == True:
            drawing_list.append((x,y,class_label))
            color_superpixel_by_class(x,y,class_label)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False


if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('img_path', help="path to image to segment")
    parser.add_argument('img_name', help="name of image to segment, JPG assumed")
    parser.add_argument('out_path', help="path to save segmented image")
    parser.add_argument('--wnd', type=int, help="crop width", default=100)
    parser.add_argument('--ds', type=int, help="image downsampling ratio", default=1)
    parser.add_argument('--nseg', type=int, help="number of segments to use with slic", default=100)
    parser.add_argument('--sigma', type=int, help="width of gaussian smoothing", default=3)
    args = parser.parse_args()

    w=args.wnd

    input_file = args.img_path + args.img_name + ".JPG"
    img = cv2.imread(input_file)[::args.ds,::args.ds,:].astype(np.uint8)
    
    # Make a copy of the image so we crop the smaller regions.
    original = img.copy()

    # Initialize segmentation mask as "other" class
    segmentation_mask = np.zeros(img[:,:,0].shape)

    segments = slic(img, n_segments=args.nseg, sigma=args.sigma)
    img = mark_boundaries(img, segments, color=(0, 0, 0))

    cv2.namedWindow('image')
    cv2.setMouseCallback('image',handle_mouse_events)

    while(1):

        cv2.imshow('image',img)
        key = cv2.waitKey(1) & 0xFF

        # 'm' - change mode from cropping to drawing
        if key == ord('m'):
            cropping = not cropping

        # 'w' - write all cropped regions and their segmentation masks'
        elif key == ord('w'):

            for px,py,pclass in drawing_list:

                # find superpixel that coord belongs to
                superpx=segments[py,px]

                # set all pixels in superpx to pclass
                segmentation_mask[segments==superpx]=pclass

            i=0
            for x,y in crop_list:
                out_file = args.out_path+args.img_name+'_w'+str(w) \
                    +'_ds'+str(args.ds)+'_'+str(i)+"_x"+str(x) \
                    +"_y"+str(y)
                crop_image = original[y-w:y+w,x-w:x+w,:]
                crop_mask = segmentation_mask[y-w:y+w,x-w:x+w]
                cv2.imwrite(out_file+".JPG",crop_image)
                cv2.imwrite(out_file+"_mask.JPG",crop_mask)
                #np.save(out_file+"_mask.npy",crop_mask) #optionally also write mask in binary numpy fmt
                i+=1

            print("Saved cropped images and masks")        
        
        elif key == 's':
            plt.close('all')
            cv2.destroyAllWindows()
            fig=plt.figure()
            plt.imshow(segmentation_mask)
            plt.show()
            print("Showing segmentation mask")

        # '0' - change to class 0
        elif key == ord('0'):
            class_label=0
            print("Selected class 0-other")

        # '1' - change to class 1
        elif key == ord('1'):
            class_label=1
            print("Selected class 1-mussel")

        # '2' - change to class 2
        elif key == ord('2'):
            class_label=2
            print("Selected class 2-ciona")

        # 'q' - quit, potentially without writing
        elif key == ord('q'):
            break

    cv2.destroyAllWindows()