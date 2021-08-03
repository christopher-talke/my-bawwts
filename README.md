# my-bawwts

Node bawwts for personal stupid things

### Backend Dockerbuild

```
docker build -t ctalke/bawwts:latest .
docker run -d -p 3005:3005 --restart unless-stopped --name=bawwts ctalke/bawwts:latest
```
