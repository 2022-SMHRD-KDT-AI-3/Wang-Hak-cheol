import cv2
import time
import locale
from pandas import interval_range
import pymysql
from sqlalchemy import create_engine

cap = cv2.VideoCapture(0)
cap.set(3, 720) # 윈도우 크기
cap.set(4, 1080)
fc = 20.0
codec = cv2.VideoWriter_fourcc('D', 'I', 'V', 'X')
count = 99
while(cap.isOpened()):
    
    #DB에 연결
    conn = pymysql.connect(host = "localhost", port = 3306, user = "root", password = "1234", db = "CCTV", charset = "utf8")

    # 연결한 데이터베이스와 상호작용하는 cursor 객체 생성하기
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    if count != time.strftime('%H',time.localtime(time.time())): # 시간이 바뀌면 영상파일을 새로 생성 (시간으로 감지)
        
        count = time.strftime('%H',time.localtime(time.time()))
        print('시간 변경 감지')
        
        out = cv2.VideoWriter(time.strftime('C:/CCTV/%Y-%m-%d %H %M',time.localtime(time.time()))+'.avi', codec, fc, (int(cap.get(3)), int(cap.get(4))))
        filename = time.strftime('%Y-%m-%d %H %M',time.localtime(time.time()))+'.avi'
        filepath = time.strftime('C:/CCTV/%Y-%m-%d %H %M',time.localtime(time.time()))+'.avi'
        sql = "INSERT INTO c_video (s_path, f_name) VALUES (%s, %s)"
        val = (filepath, filename)
        cursor.execute(sql, val)
        conn.commit()
        conn.close()
        print('파일 생성:',filename)
    
    ret, frame = cap.read()
    #frame = cv2.flip(frame,1) # 화면 반전 0: 상하, 1: 좌우
    # 시간 텍스트 출력
    cv2.putText(frame, text=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())), org=(30, 450), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(0,255,0), thickness=2)
    
    if ret==True:
        cv2.imshow('Record&Save', frame)
        out.write(frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break
    
cap.release()
cv2.destroyAllWindows()