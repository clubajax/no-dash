(function (root, factory) {
	if (typeof customLoader === 'function'){ customLoader(factory, 'nodash'); }
	else if (typeof define === 'function' && define.amd){ define([], factory); }
	else if(typeof exports === 'object'){ module.exports = factory(); }
	else{ root.returnExports = factory();
		window.nodash = factory(); }
}(this, function () {

	const global = typeof window !== undefined ? window : global;

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

		console.warn('Unsure of type:', type);
		return a === b;
	}

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

	const nodash = {
		copy,
		equal,
		getType
	};

	return nodash;

}));