from PIL import Image
import cv2
import numpy as np
import os
def rgb_to_hex(rgb):
    return '%02x%02x%02x' % rgb

def load_image(filename):
    path = "C:\\Projects\\Artag"
    img = Image.open(os.path.join(path,filename))
    return np.array(img)
def createDataset(imgPath,srcPath):
    print("fsfd")
    img = load_image(imgPath)
    newarr = []
    print("fsdfsdfsdfds")

    for i in range(len(img)):
        for j in range(len(img[0])):
            # newarr.append(hex(img[i][j][0]).split('x')[-1].upper()+hex(img[i][j][1]).split('x')[-1].upper()+hex(img[i][j][2]).split('x')[-1].upper())
            newarr.append(rgb_to_hex((img[i][j][0],img[i][j][1],img[i][j][2])))
            # newarr.append(hex(img[i][j][0]).split('x')[-1] + hex(img[i][j][1]).split('x')[-1] + hex(img[i][j][2]).split('x')[-1])
    # print(newarr)
    # print(newarr[521804])
    f = open(srcPath, 'w')
    cnt = 0
    hm = len(newarr)-1
    for index in newarr:
        if not(cnt == hm):
            f.write(index + ' ')
        else:
            f.write(index)
        cnt+=1
    f.close()
    print(img.shape )
    print(cnt)
    if (cnt != len(img[0]) * len(img)):
        print("something went wrong")
    print("done")


# "ARTags\\0\\0_7.jpg"
path = "ARTags\\"
createDataset("src\\wideCow.jpg","C:\\Projects\\Artag\\res\\cow.txt")
# picks = [9,8,9,9,5,5,8,10,12,8,10,11,8,7,5,6]
# for i in range(16):
#     for j in range(1,picks[i]+1):
#         createDataset(path+str(i)+"\\"+str(i)+"_"+str(j)+".jpg","src\\"+str(i)+"_"+str(j)+".txt")