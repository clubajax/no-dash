(function (root, factory) {
	if (typeof customLoader === 'function'){ customLoader(factory, 'nodash'); }
	else if (typeof define === 'function' && define.amd){ define([], factory); }
	else if(typeof exports === 'object'){ module.exports = factory(); }
	else{ root.returnExports = factory();
		window.nodash = factory(); }
}(this, function () {

	const global = typeof window !== undefined ? window : global;

	function copy (data) {
		let newData;
		if (Array.isArray(data)) {
			return data.map((item) => {
				if (item && typeof item === 'object') {
					return copy(item);
				}
				return item;
			});
		}
		if (data && typeof data === 'object') {

			if (data.innerHTML || data === global) {
				throw new Error('HTMLElements and the window object cannot be copied');
			}

			if (data instanceof Date) {
				return new Date(data.getTime());
			}

			if (data instanceof Function) {
				return data;
			}

			// needs to be reduce
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
		if (typeof a !== typeof b) {
			return false;
		}
		const type = typeof a;
		if (/number|string/.test(type)){
			return a === b;
		}

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
		return typeof item;
	}

	const nodash = {
		copy,
		equal,
		getType
	};

	return nodash;

}));