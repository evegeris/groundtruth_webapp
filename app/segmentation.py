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
import os
import time
import datetime

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

        self.imArray = []
        self.segm_lists = []
        self.out_files = []

        #self.scale = 0.2
        self.scale = 1
        self.im_height, self.im_width, self.im_channels = self.im.shape

        #self.im = cv2.resize(self.im, (0,0), fx=self.scale, fy=self.scale)
        #cv2.imshow("input", self.im)
        self.im_rgb = np.array(self.im)



    def segment(self):

        n = array.array('i')
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


        self.imArray = []
        for i in range(0,3): # runs 3 times
            #numSegments = 566
            #mySigma = 6

            ts = time.time()
            st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H-%M-%S')
            #self.out_files.append( str(n[i])+'seg_sigma'+str(s[i])+"_datetime"+st )
            self.out_files.append( str(n[i])+"_datetime"+st )

            newIm = self.im;
            #cv2.imwrite("/home/madison/Documents/41x/IMG_SET6/" + self.out_files[i] +"_origin_elaine.jpg", newIm)

            # apply SLIC and extract (approximately) the supplied number of segments
            segments = slic(self.im, n_segments=n[i], sigma=s[i])

            b = segments.tolist() # nested lists with same data, indices

            #with open('/home/madison/Documents/41x/IMG_SET6/' + self.out_files[i] +'.json', 'w') as outfile:
            #	    json.dump(b, outfile, indent=2)

            #self.segm_lists.append(json.dumps(b, indent=2))
            self.segm_lists.append(b)

            # show the output of SLICs
            fig = plt.figure("Superpixels -- %d segments" % (n[i]))
            ax = fig.add_subplot(1, 1, 1)
            newIm = mark_boundaries(self.im, segments, color=(52, 205, 195)) # fn normalises img bw 1 and 0 apparently
            #ax.imshow(self.im)
            plt.axis("off")
            #cv2.waitKey(0)

            newIm = (newIm * 255.0).astype('u1')
            self.imArray.append(newIm)
            #cv2.imshow("after astype", self.newIm)
            #cv2.imwrite("/home/madison/Documents/41x/IMG_SET6/" + out_file +".jpg", self.newIm)
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

def getSegmentedImage(filepath, rootpath, cropStartX, cropStartY, cropWidth, cropHeight):
    global pixels

    x1 = cropStartX
    x2 = cropStartX + cropWidth

    y1 = cropStartY
    y2 = cropStartY + cropHeight

    pixels = cropWidth*cropHeight
    #s3 = 13.46359 + (2.195932 - 13.46359)/(1 + pow(pixels/2724264.0,2.523085))
    s3 = 2.275 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2)
    print s3

    fullpath = os.path.join(rootpath, 'templates/static/images/') + filepath
    im = cv2.imread(fullpath)
    im = im[y1:y2,x1:x2,:] # NOTE: its img[y: y + h, x: x + w]

    newIm = cv2.imread(fullpath)
    newIm = newIm[y1:y2,x1:x2,:]

    postprocessor = PostProc(im)
    postprocessor.segment()

    #writepath = rootpath + "/templates/static/images/wound_images/segmented/" + postprocessor.out_files[0] +".jpg"
    #print("WRITE FULLPATH --- "+ writepath)
    #cv2.imwrite(writepath, imArray[0])

    imDict = dict()
    imDict['arrayLength'] = len(postprocessor.imArray)
    for idx, val in enumerate(postprocessor.imArray):
        #print(idx)
        #imDict['img'+str(idx)] = postprocessor.imArray[idx]
        #imDict['json'+str(idx)] = postprocessor.segm_lists[idx]
        #imDict['out_file'+str(idx)] = postprocessor.out_files[idx]

        fullpath_json = os.path.join(rootpath, 'templates/static/images/json/') + postprocessor.out_files[idx] +'.json'
        relative_json = 'json/' + postprocessor.out_files[idx] +'.json'

        with open(fullpath_json, 'a+') as outfile:
            json.dump(postprocessor.segm_lists[idx], outfile, indent=2)

        imDict['json'+str(idx)] = relative_json

        fullpath_segmented = os.path.join(rootpath, 'templates/static/images/segmented/') + postprocessor.out_files[idx] + "_segmented.jpg"
        relative_segmented = 'segmented/' + postprocessor.out_files[idx] + "_segmented.jpg"

        cv2.imwrite(fullpath_segmented, postprocessor.imArray[idx])

        imDict['img'+str(idx)] = relative_segmented


    return imDict
