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


	self.newIm = self.im;

       	numSegments = 100
        my_sigma=3.67
       	# apply SLIC and extract (approximately) the supplied number of segments
       	segments = slic(self.im, n_segments=numSegments, sigma=my_sigma)

       	b = segments.tolist() # nested lists with same data, indices
       	file_path = "file.json" ## your path variable

        global out_file
        out_file = str(numSegments)+'seg_sigma'+str(my_sigma)+'_ds'+str(ds)

       	with open(out_file+'.json', 'w') as outfile:
           		json.dump(b, outfile, indent=2)

       	# show the output of SLIC
       	fig = plt.figure("Superpixels -- %d segments" % (numSegments))
       	ax = fig.add_subplot(1, 1, 1)
       	self.newIm = mark_boundaries(self.im, segments, color=(0, 0, 0)) # fn normalises img bw 1 and 0 apparently
       	#ax.imshow(self.im)
       	plt.axis("off")
       	#cv2.waitKey(0)

       	self.newIm = (self.newIm * 255.0).astype('u1')
       	cv2.imshow("after astype", self.newIm)
       	cv2.imwrite("/home/madison/Documents/angus/"+out_file+".jpg", self.newIm)
        cv2.imwrite("/home/madison/Documents/angus/"+out_file+"orig.jpg", self.im)
       	cv2.waitKey(0)


def test():
	#filepath = "/home/mmccar04/Downloads/TestImages/raptor.jpg"
	#filepath = "/home/lainey/code/rdash_Nov2/groundtruth_webapp/app/templates/static/images/Pressure08.jpg"
	filepath = "/home/madison/Documents/angus/IMG_5351.JPG"
	global ds
	ds=4
	x1=300
	y1=100
	x2=600
	y2=400

	im = cv2.imread(filepath)[::ds,::ds]
	im = im[x1:x2,y1:y2,:]
	newIm = cv2.imread(filepath)[::ds,::ds]
	newIm = newIm[x1:x2,y1:y2,:]
	postprocessor = PostProc(im)
	postprocessor.segment()
	#postprocessor.getContours()



test()

