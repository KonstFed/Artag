from PIL import Image
import cv2
import numpy as np
import os
def rgb_to_hex(rgb):
    return '%02x%02x%02x' % rgb

def load_image(filename):
    path = "C:\\Projects\\GitHub\\NTI_contest\\robot_artag_maze"
    img = Image.open(os.path.join(path,filename))
    return np.array(img)
img = load_image("src\\hardtest.jpg")
newarr = []


for i in range(len(img)):
    for j in range(len(img[0])):
        # newarr.append(hex(img[i][j][0]).split('x')[-1].upper()+hex(img[i][j][1]).split('x')[-1].upper()+hex(img[i][j][2]).split('x')[-1].upper())
        newarr.append(rgb_to_hex((img[i][j][0],img[i][j][1],img[i][j][2])))
        # newarr.append(hex(img[i][j][0]).split('x')[-1] + hex(img[i][j][1]).split('x')[-1] + hex(img[i][j][2]).split('x')[-1])
        if (i == 543 and j ==524):
            print(img[i][j])
            print(newarr[-1])
            print("hel-")
# print(newarr)
# print(newarr[521804])
f = open('test_in_text1.txt', 'w')
cnt = 0
hm = len(newarr)-1
print(hm)
for index in newarr:
    if not(cnt == hm):
        f.write(index + ',')
    else:
        f.write(index)
    cnt+=1
f.close()

print(cnt)