# import the necessary packages
from skimage.segmentation import slic
from skimage.segmentation import mark_boundaries
from skimage.util import img_as_float
from skimage import io
import matplotlib.pyplot as plt
import cv2
import numpy as np
import random

filepath = "/home/lainey/Pictures/Research Images Not For Distribution/Artificial/Pressure08.jpg" # good
#filepath = "/home/lainey/Pictures/Research Images Not For Distribution/Artificial/Pressure07.jpg" # good
# load the image
im = cv2.imread(filepath)

height, width, channels = im.shape
scale = 0.2
im = cv2.resize(im, (0,0), fx=scale, fy=scale)
cv2.imshow("input", im)
im_rgb = np.array(im)


### segment

numSegments = 300
# apply SLIC and extract (approximately) the supplied number of segments
segments = slic(im, n_segments=numSegments, sigma=5)

# show the output of SLIC
fig = plt.figure("Superpixels -- %d segments" % (numSegments))
ax = fig.add_subplot(1, 1, 1)
im = mark_boundaries(im, segments, color=(0, 0, 0)) # fn normalises img bw 1 and 0 apparently
ax.imshow(im)
plt.axis("off")
#cv2.waitKey(0)

im = (im * 255.0).astype('u1')
cv2.imshow("after astype", im)
#'''

### get contours

# convert to greyscale
im = cv2.cvtColor( im, cv2.COLOR_RGB2GRAY )

# binary thresh and non-zero pixels to 1 if
thresh = 5
maxValue = 255
th, im = cv2.threshold(im, thresh, maxValue, cv2.THRESH_BINARY)
im = (255-im) # temp, invert
cv2.imshow("after binary thresh", im)

im2, contours, hierarchy = cv2.findContours(im, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
hierarchy = hierarchy[0] # for some reason, contours is a nice list and hierarchy is an ndarray with more dimensions that necessary

for index in range(len(contours)):
    area = cv2.contourArea(contours[index])
    #print "contour area: " + str(area)
    thresh = width*0.15 # some way of deciding which pixel areas are noise
    #print "contour thresh: "+ str(thresh)
    if area < thresh:
        continue
    if hierarchy[index][2] != -1:
        continue

    cv2.drawContours(im_rgb, contours, index, (random.randrange(0, 255), random.randrange(0, 255), random.randrange(0, 255)), -1)
    #print "hierarchy["+str(index)+"]: " + str(hierarchy[index])


cv2.imshow("contour img", im_rgb)
cv2.imshow("im2", im2)
cv2.waitKey(0)



