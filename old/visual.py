from PIL import Image 
import numpy as np
import matplotlib.pyplot as plt
def grayscale(rgb):
    # f = rgb[0:2]
    # s = rgb[2:2]
    # l 

    return int(rgb[0:2],16)*0.299 + int(rgb[2:4],16)*0.587 + int(rgb[4:6],16)*0.114
corners = [[17,44],
[18,85],
[30,63],
[31,65],
[42,54],
[43,58],
[43,81],
[43,81],
[54,51],
[55,55],
[55,63],
[67,71]]
f = open("C:\\Projects\\GitHub\\NTI_contest\\robot_artag_maze\\Задача 2.6\\test_0.txt","r")
for line in f:
    mya = line.split(" ")
    break
myarray = []
cnt = 0
for i in range(120):
    myarray.append([])
    for j in range(160):
        myarray[i].append(grayscale(mya[cnt]))
        cnt=cnt+1
for i in range(len(corners)):
    cur = corners[i]
    i1 = cur[0]
    j1 = cur[1]
    myarray[i1][j1] == 120
myaq = np.array(myarray)
im = Image.fromarray(myaq) 
im.show()