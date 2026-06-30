from math import cos, sin, atan, sqrt, pi
from pyscript import document
def calculate(event=None):
    try:
        lat1 = float(document.getElementById("lat1").value)
        lat2 = float(document.getElementById("lat2").value)
        lon1 = float(document.getElementById("lon1").value)
        lon2 = float(document.getElementById("lon2").value)
    except ValueError:
        document.getElementById("result").innerText = "Please enter valid numbers."
        return
    a = 6378.14
    f = 1/298.257
    F_0 = (lat1 + lat2)/2
    G_0 = (lat1 - lat2)/2
    l_0 = (lon1 - lon2)/2
    F = F_0*pi/180
    G = G_0*pi/180
    l = l_0*pi/180
    S = sin(G)**2*cos(l)**2 + cos(F)**2*sin(l)**2
    C = cos(G)**2*cos(l)**2 + sin(F)**2*sin(l)**2
    w = atan(sqrt(S/C))
    R = sqrt(S*C)/w
    D = 2*w*a
    H1 = (3*R-1)/(2*C)
    H2 = (3*R+1)/(2*S)
    distance = D*(1 + f*H1*sin(F)**2*cos(G)**2 - f*H2*cos(F)**2*sin(G)**2)
    document.getElementById("result").innerText = f"The distance is {round(distance,2)} km"
