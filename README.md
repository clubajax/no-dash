# NoDash

Smaller, common utility functionality used to replace LoDash

In development. Not ready for common use.

## Docs

Objects
-------

### copy
Creates a deep copy of a JavaScript object. HTML elements will throw errors. functions are passed as references.

### equal
Determines if two objects have deep equality.

### getObject
Returns a value from an object based on a stringified path.

### setObject
Sets a value to an object based on a stringified path.

Arrays
------

### loop
A "lazy" for-loop.

### sawLoop
Loops across an array of arrays, starting with 0 of each array:

	0:0, 0:1, 0:2 - 1:0, 1:1, 1:2 - etc

Called a "saw" loop because it starts at the top of the first, goes down to the bottom, and moves up to the top of the second.

### deDupe
Removes duplicates from arrays. A second, optional argument is `property` for dealing with arrays of objects.

Values
------

### getType
Extends the native `typeof` to also return:
* array
* date
* html
* nan
* null

Strings
-------

### dashify
Replaces spaces with dashes

### cap
Capitalizes a word