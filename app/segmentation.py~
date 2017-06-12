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
#import multiprocessing

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

        self.scale = 1
        self.im_height, self.im_width, self.im_channels = self.im.shape

        self.im_rgb = np.array(self.im)



    def segment(self):

        n = array.array('i')
        s = array.array('f')
        n.append(466)
        n.append(500)
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
            s.append(10)
            s.append(13)
            s.append(14)
            s.append(15)
            s.append(18)


        self.imArray = []
        for i in range(0,5): # runs 5 times

            self.out_files.append( str(n[i])+"_datetime"+st )

            newIm = self.im;

            # apply SLIC and extract (approximately) the supplied number of segments
            segments = slic(self.im, n_segments=n[i], sigma=s[i])

            b = segments.tolist() # nested lists with same data, indices

            self.segm_lists.append(b)

            newIm = mark_boundaries(self.im, segments, color=(52, 205, 195)) # fn normalises img bw 1 and 0 apparently

            newIm = (newIm * 255.0).astype('u1')
            self.imArray.append(newIm)



#This is the main for the Python Script, called by '__init__.py'
#Crops the image, saves the cropped image, then segments the image 5 times
def getSegmentedImage(filepath, rootpath, cropStartX, cropStartY, cropWidth, cropHeight, uid):

    global pixels
    global st

    x1 = cropStartX
    x2 = cropStartX + cropWidth

    y1 = cropStartY
    y2 = cropStartY + cropHeight

    pixels = cropWidth*cropHeight
    s3 = 2.275 + 0.0000009166667*pixels + 0.0000000000001083333*pow(pixels,2)


    fp = os.getcwd()
    fp = fp.rsplit('/',1)[0] 
    fullpath = fp+'/GT_USERS/USER_'+uid+'/'+filepath
    im = cv2.imread(fullpath)

    # fit blocks of 256x256 to crop
    '''
    remW = cropWidth % 256
    remH = cropHeight % 256
    print cropWidth
    print cropHeight
    print '..........................'
    print remW
    print remH
    '''

    im = im[y1:y2,x1:x2,:] # NOTE: its img[y: y + h, x: x + w]


    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H-%M-%S')
    fp = os.getcwd()
    fp = fp.rsplit('/',1)[0]
    fullpath_cropped = fp+'/GT_USERS/USER_'+uid+'/cropped/' + "datetime"+st + "_cropped.jpg"

    cv2.imwrite(fullpath_cropped, im)

    newIm = cv2.imread(fullpath)
    newIm = newIm[y1:y2,x1:x2,:]

    #Calls to segment the image
    postprocessor = PostProc(im)
    postprocessor.segment()


    imDict = dict()
    imDict['arrayLength'] = len(postprocessor.imArray)
    for idx, val in enumerate(postprocessor.imArray):


        '''
        fullpath_json = os.path.join(rootpath, 'templates/static/images/json/') + postprocessor.out_files[idx] +'.json'
        relative_json = 'json/' + postprocessor.out_files[idx] +'.json'
        '''

        fp = os.getcwd()
        fp = fp.rsplit('/',1)[0] # go back one dir

        fullpath_json = fp+'/GT_USERS/USER_'+uid+'/json/' + postprocessor.out_files[idx] +'.json'
        relative_json = 'json/' + postprocessor.out_files[idx] +'.json'

        with open(fullpath_json, 'a+') as outfile:
            json.dump(postprocessor.segm_lists[idx], outfile, indent=2)

        imDict['json'+str(idx)] = relative_json


        fullpath_segmented = fp+'/GT_USERS/USER_'+uid+'/segmented/' + postprocessor.out_files[idx] + "_segmented.jpg"
        relative_segmented = 'segmented/' + postprocessor.out_files[idx] + "_segmented.jpg"

        cv2.imwrite(fullpath_segmented, postprocessor.imArray[idx])

        imDict['img'+str(idx)] = relative_segmented


    return imDict
