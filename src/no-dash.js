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

		if (type === 'map') {
			return new Map(data);
		}

		if (type === 'set') {
			return new Set(data);
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
			return a.length === b.length && a.every((item, i) => {
				return equal(item, b[i]);
			});
		}

		if (type === 'object' || type === 'map' || type === 'set') {
			return Object.keys(a).every((key) => {
				return equal(a[key], b[key]);
			})
		}

		return a === b;
	}

	function getObject (o, path) {
		const paths = path.split('.');
		let value = o;
		let key;
		for (let i = 0; i < paths.length; i++) {
			key = paths[i];
			if (value[key] !== undefined) {
				value = value[key];
			} else {
				return null;
			}
		}
		return value;
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

	function equalValues (a, b) {
		const aTest = a.every(aItem => !!b.find(bItem => bItem === aItem));
		const bTest = b.every(bItem => !!a.find(aItem => aItem === bItem));
		return aTest && bTest;
	}

	function loop (count, callback) {
		for (let i = 0; i < count; i++) {
			callback(i);
		}
	}

	function remove (array, value) {
		array = [...array];
		for (let i = array.length - 1; i >= 0 ; i--) {
			if (value === array[i]) {
				array.splice(i, 1);
			}
		}
		return array;
	}

	function same (array, prop) {
		const getValue = item => prop ? item[prop] : item;
		const value = getValue(array[0]);
		for( let i = 0; i < array.length; i++ ) {
			if (!equal(getValue(array[i]), value)) {
				return false;
			}
		}
		return true;
	}

	function deDupe (array, prop) {
		const props = [];
		if (prop) {
			return array.filter((item) => {
				if (props.find(p => item[prop] === p)) {
					return false;
				}
				props.push(item[prop]);
				return true;
			});
		}
		return array.filter((item) => {
			if (props.find(p => item === p)) {
				return false;
			}
			props.push(item);
			return true;
		});
	}

	function sawLoop (collection, callback) {
		const result = [];
		collection[0].forEach((nada, valueIndex) => {
			collection.forEach((values, collectionIndex) => {
				const value = values[valueIndex];
				if (callback) {
					callback(value, valueIndex, collectionIndex);
				}
				result.push(value);
			});
		});
		return result;
	}

	function collectValues (arr, props) {

	}

	function collectProperties (item, props) {

	}

	// VALUES

	function getType (item) {

		if (item === null) {
			return 'null';
		}
		if (typeof item === 'object') {
			if (Array.isArray(item)) {
				return 'array';
			}
			if (item instanceof Date) {
				return 'date';
			}
			if (item instanceof Promise) {
				return 'promise';
			}
			if (item instanceof Error) {
				return 'error';
			}
			if (item instanceof Map) {
				return 'map';
			}
			if (item instanceof WeakMap) {
				return 'weakmap';
			}
			if (item instanceof Set) {
				return 'set';
			}
			if (item instanceof WeakSet) {
				return 'weakset';
			}
			if (item === global) {
				if (typeof window !== undefined) {
					return 'window';
				}
				return 'global';
			}
			if (item.documentElement || item.innerHTML !== undefined) {
				return 'html';
			}
			if(item.length !== undefined && item.callee) {
				return 'arguments'
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



	return {
		// objects
		copy,
		equal,
		getObject,
		setObject,

		// array
		equalValues,
		loop,
		deDupe,
		sawLoop,
		remove,
		same,

		// types
		getType,

		// string
		dashify,
		cap
	};

}));