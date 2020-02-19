import cv2
import numpy as np
import math
from PIL import Image
from matplotlib import pyplot as plt

def convoling_sum(img,size):
    newimg = np.zeros_like(img)
    rad = math.trunc(size/2)
    s = (rad*2 + 1)^2
    for i in range(len(img)):
        for j in range(len(img[0])):
            if (i <= rad-1 or i >= len(img)-rad or j < rad or j >= len(img)-rad):
                continue
            znach = 0
            for c in range(-rad,rad+1):
                for d in range(-rad,rad+1):
                    znach += img[i+c][j+d]
            newimg[i][j] = znach/s
    return newimg
            
                    
def centroid_corners(img,porog):
    rar = img.copy()
    corners = []
    for i in range(len(rar)):
        for j in range(len(rar[0])):
            if (img[i][j]>porog):
                hmx = []
                hmy = []
                mas =[]
                hmx.append(i)
                hmy.append(j)
                mas.append([i,j])
                img[i,j] = 0
                while(len(mas)>0):
                    cur = mas[0]
                    del mas[0]
                    for c in range(-1,2):
                        for d in range(-1,2):
                            if c == 0 and d == 0:
                                continue
                            if c == d and c==1:
                                print("fs")
                            if img[i+c][j+d]>porog:
                                hmx.append(i+c)
                                hmy.append(j+d)
                                mas.append([i+c,j+d])
                                img[i+c][j+d] = 0
                srx = math.trunc(sum(hmx)/len(hmx))
                sry = math.trunc(sum(hmy)/len(hmy))
                corners.append([srx,sry])
    return corners

                

imgar = cv2.imread("C:\\Projects\\GitHub\\NTI_contest\\robot_artag_maze\\src\\test1.jpg")

img = cv2.cvtColor(imgar,cv2.COLOR_RGB2GRAY)
img = cv2.threshold(img,60,255,cv2.THRESH_BINARY)[1]

img = cv2.GaussianBlur(img,(3,3),cv2.BORDER_DEFAULT)


sobelx = cv2.Sobel(img,cv2.CV_64F,1,0,ksize=3)
sobely = cv2.Sobel(img,cv2.CV_64F,0,1,ksize=3)
sobel = np.hypot(sobelx,sobely)
dst = cv2.cornerHarris(img,2,3,0.02)
# dst = cv2.dilate(dst,None)

znag = 0.01*dst.max()
indoor = imgar.copy()

indoor[dst>znag]=[255,0,0]
plt.imshow(indoor)
plt.show()
corn = centroid_corners(dst,znag)
for i in corn:
    imgar[i[0]][i[1]] = [255,0,0]

# cv2.imshow("dst",imgar)
# cv2.waitKey(0)

plt.imshow(imgar)
plt.show()
# sobel = cv2.threshold(sobel,60,255,cv2.THRESH_BINARY)[1]
# sobel[sobel<700] = 0
# cv2.imshow("Sobel",sobel)
# cv2.waitKey(0)
# print(sobel[sobel>60].max())
# print(sobel[sobel>60].min())
# anaz = sorted(sobel.flatten(),reverse=True)
# hm = convoling_sum(sobel,3)

# print(hm.max())
# print(hm[hm>10].min())

# hm[hm<1000] = 0

# cv2.imshow("ng",hm)
# cv2.waitKey(0)

# plt.hist(hm.flatten())
# plt.show()

