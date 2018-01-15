(function (root, factory) {
	if (typeof customLoader === 'function'){ customLoader(factory, 'nodash'); }
	else if (typeof define === 'function' && define.amd){ define([], factory); }
	else if(typeof exports === 'object'){ module.exports = factory(); }
	else{ root.returnExports = factory();
		window.nodash = factory(); }
}(this, function () {

	const global = typeof window !== undefined ? window : global;

	// OBJECTS

	function copy (data) {
		if (!data) {
			return data;
		}
		const type = getType(data);
		if (type === 'array') {
			return data.map((item) => {
				if (item && typeof item === 'object') {
					return copy(item);
				}
				return item;
			});
		}

		if (type === 'html' || type === 'window') {
			throw new Error('HTMLElements and the window object cannot be copied');
		}

		if (type === 'date') {
			return new Date(data.getTime());
		}

		if (type === 'function') {
			return data;
		}

		if (type === 'object') {
			return Object.keys(data).reduce((obj, key) => {
				const item = data[key];
				if (typeof item === 'object') {
					obj[key] = copy(item);
				} else {
					obj[key] = data[key];
				}
				return obj;
			}, {});
		}
		return data;
	}

	function equal (a, b) {
		const typeA = getType(a);
		const typeB = getType(b);
		if (typeA !== typeB) {
			return false;
		}
		const type = typeA;
		if (/number|string|boolean/.test(type)){
			return a === b;
		}

		if (type === 'date') {
			return a.getTime() === b.getTime();
		}

		if (type === 'nan') {
			return true;
		}

		if (type === 'array') {
			return a.every((item, i) => {
				return equal(item, b[i]);
			});
		}

		if (type === 'object') {
			return Object.keys(a).every((key) => {
				return equal(a[key], b[key]);
			})
		}

		console.warn('equality is unsure of type:', type);
		return a === b;
	}

	function getObject (o, path) {
		return path.split('.').reduce((obj, key) => {
			if (obj && typeof obj === 'object' && obj[key]) {
				return obj[key];
			}
			return null;
		}, o);
	}

	function setObject (o, path, value) {
		return path.split('.').reduce((obj, key, i, array) => {
			if (i === array.length - 1) {
				obj[key] = value;
				return obj;
			}
			if (typeof obj[key] !== 'object') {
				if (isNaN(parseInt(key))) {
					obj[key] = {};
				} else {
					obj[key] = [];
				}
			}
			return obj[key];
		}, o);
	}

	// ARRAYS
	function loop (count, callback) {
		for (let i = 0; i < count; i++) {
			callback(i);
		}
	}

	function sawLoop (collection, callback) {
		collection[0].forEach((nada, valueIndex) => {
			collection.forEach((values, collectionIndex) => {
				callback(values[valueIndex], valueIndex, collectionIndex);
			});
		})
	}

	function collectValues (arr, props) {

	}

	function collectProperties (item, props) {

	}

	// VALUES

	function getType (item) {
		if (typeof item === 'object') {
			if (Array.isArray(item)) {
				return 'array';
			}
			if (item instanceof Date) {
				return 'date';
			}
			if (item === global) {
				return 'window';
			}
			if (item.documentElement || item.innerHTML !== undefined) {
				return 'html';
			}
		}
		if (typeof item === 'number' && isNaN(item)) {
			return 'nan';
		}
		return typeof item;
	}

	// STRINGS

	function dashify (word) {
		return word.replace(/\s/g, '-').toLowerCase();
	}

	function cap (word) {
		return word.substring(0, 1).toUpperCase() + word.substring(1);
	}



	const nodash = {
		copy,
		equal,
		getObject,
		setObject,

		loop,
		sawLoop,

		getType,

		dashify,
		cap
	};

	return nodash;

}));