# import the necessary packages
from skimage.segmentation import slic
from skimage.segmentation import mark_boundaries
from skimage.util import img_as_float
from skimage import io
import matplotlib.pyplot as plt
import cv2
import numpy as np
import random
import json
import sys
import array

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

class PostProc:

    def __init__(self, im):
        self.im = im

        #self.scale = 0.2
        self.scale = 1
        self.im_height, self.im_width, self.im_channels = self.im.shape

        #self.im = cv2.resize(self.im, (0,0), fx=self.scale, fy=self.scale)
        #cv2.imshow("input", self.im)
        self.im_rgb = np.array(self.im)


    def segment(self):

        n = array.array('f')
        s = array.array('f')
        #n.append(466)
        #n.append(500)
        n.append(100)
        n.append(600)
        n.append(566)
        n.append(600)
        n.append(666)

        if pixels < 1000000:
            s.append(1.7)
            s.append(2.7)
            s.append(3.3)
            s.append(3.9)
            s.append(4.9)

        elif pixels < 7000000:

            s.append(2.275 - 1.5 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2))
            s.append(2.275 - 1 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2))
            s.append(2.275 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2))
            s.append(2.275 + 1 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2))
            s.append(2.275 + 1.5 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2))

        elif pixels > 7000000:
            #s.append(10)
            #s.append(13)
            s.append(18)
            s.append(8)
            s.append(14)
            s.append(15)
            s.append(18)


        for i in range(0,2):
            #numSegments = 566
            #mySigma = 6
            out_file = str(n[i])+'seg_sigma'+str(s[i])

            self.newIm = self.im;
            cv2.imwrite("/home/madison/Documents/41x/IMG_SET6/" + out_file +"_origin.jpg", self.newIm)


            # apply SLIC and extract (approximately) the supplied number of segments
            segments = slic(self.im, n_segments=n[i], sigma=s[i])

            b = segments.tolist() # nested lists with same data, indices

            with open('/home/madison/Documents/41x/IMG_SET6/' + out_file +'.json', 'w') as outfile:
            	    json.dump(b, outfile, indent=2)

            # show the output of SLIC
            fig = plt.figure("Superpixels -- %d segments" % (n[i]))
            ax = fig.add_subplot(1, 1, 1)
            self.newIm = mark_boundaries(self.im, segments, color=(52, 205, 195)) # fn normalises img bw 1 and 0 apparently
            #ax.imshow(self.im)
            plt.axis("off")
            #cv2.waitKey(0)

            self.newIm = (self.newIm * 255.0).astype('u1')
            #cv2.imshow("after astype", self.newIm)
            cv2.imwrite("/home/madison/Documents/41x/IMG_SET6/" + out_file +".jpg", self.newIm)
            #cv2.waitKey(0)



def test():

    print 'Number of arguments:', len(sys.argv), 'arguments.'
    print 'Argument List:', str(sys.argv)

    global pixels

    cropStartX = int(sys.argv[1])
    cropStartY = int(sys.argv[2])
    cropWidth = int(sys.argv[3])
    cropHeight = int(sys.argv[4])
    #filepath = sys.argv[5]

    x1 = cropStartX
    x2 = cropStartX + cropWidth

    y1 = cropStartY
    y2 = cropStartY + cropHeight

    pixels = cropWidth*cropHeight
    #s3 = 13.46359 + (2.195932 - 13.46359)/(1 + pow(pixels/2724264.0,2.523085))
    s3 = 2.275 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2)
    print s3

    filepath = "/home/madison/Documents/41x/IMG_1144.jpg"
    im = cv2.imread(filepath)
    im = im[y1:y2,x1:x2,:] # NOTE: its img[y: y + h, x: x + w]

    newIm = cv2.imread(filepath)
    newIm = newIm[y1:y2,x1:x2,:]

    postprocessor = PostProc(im)
    postprocessor.segment()

test()
