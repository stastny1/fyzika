Na development je použitý parcel

```
npx parcel index.html
```
Celkom zaujímavý efekt (vložiť do konzole)

```
physics.loop()

setInterval(() => {
  	let rect1 = new Rect(150, 60, -2, 0, 10, "blue", ctx);
		physics.addObject(rect1);
    }, 15);

```