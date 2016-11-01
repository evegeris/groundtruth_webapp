# import the necessary packages
from skimage.segmentation import slic
from skimage.segmentation import mark_boundaries
from skimage.util import img_as_float
from skimage import io
import matplotlib.pyplot as plt
import cv2
import numpy as np
import random


class PostProc:

    def __init__(self, im):
        self.im = im

        self.scale = 0.2
        self.im_height, self.im_width, self.im_channels = self.im.shape

        self.im = cv2.resize(self.im, (0,0), fx=self.scale, fy=self.scale)
        cv2.imshow("input", self.im)
        self.im_rgb = np.array(self.im)



    def segment(self):

        numSegments = 300
        # apply SLIC and extract (approximately) the supplied number of segments
        segments = slic(self.im, n_segments=numSegments, sigma=5)

        # show the output of SLIC
        fig = plt.figure("Superpixels -- %d segments" % (numSegments))
        ax = fig.add_subplot(1, 1, 1)
        self.im = mark_boundaries(self.im, segments, color=(0, 0, 0)) # fn normalises img bw 1 and 0 apparently
        ax.imshow(self.im)
        plt.axis("off")
        #cv2.waitKey(0)

        self.im = (self.im * 255.0).astype('u1')
        cv2.imshow("after astype", self.im)



    def getContours(self):

        # convert to greyscale
        self.im = cv2.cvtColor( self.im, cv2.COLOR_RGB2GRAY )

        # binary thresh and non-zero pixels to 1 if
        thresh = 5
        maxValue = 255
        th, self.im = cv2.threshold(self.im, thresh, maxValue, cv2.THRESH_BINARY)
        self.im = (255-self.im) # temp, invert
        cv2.imshow("after binary thresh", self.im)

        im2, contours, hierarchy = cv2.findContours(self.im, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        hierarchy = hierarchy[0] # for some reason, contours is a nice list and hierarchy is an ndarray with more dimensions that necessary

        for index in range(len(contours)):
            area = cv2.contourArea(contours[index])
            #print "contour area: " + str(area)
            thresh = self.im_width*0.15 # some way of deciding which pixel areas are noise
            #print "contour thresh: "+ str(thresh)
            if area < thresh:
                continue
            if hierarchy[index][2] != -1:
                continue

            cv2.drawContours(self.im_rgb, contours, index, (random.randrange(0, 255), random.randrange(0, 255), random.randrange(0, 255)), -1)
            #print "hierarchy["+str(index)+"]: " + str(hierarchy[index])


        cv2.imshow("contour img", self.im_rgb)
        cv2.imshow("im2", im2)
        cv2.waitKey(0)


def test():
    filepath = "/home/lainey/Pictures/Research Images Not For Distribution/Artificial/Pressure08.jpg"
    im = cv2.imread(filepath)
    postprocessor = PostProc(im)
    postprocessor.segment()
    postprocessor.getContours()


#test()

