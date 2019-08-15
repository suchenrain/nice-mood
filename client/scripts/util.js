/* eslint-disable import/no-commonjs */
module.exports = {
    toCamel: function (s) {
        return s.replace(/([-_][a-z])/ig, function ($1) {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });
    }
}