import Category from 'discourse/models/category';

export default Ember.Component.extend({
    selection: null,
    blacklist: null,
    categories: null,

    init() {
        this._super(...arguments);

        if (!this.selection) this.set('selection', []);
        if (!this.blacklist) this.set('blacklist', []);
        if (!this.categories) {
            const blacklist = Ember.makeArray(this.blacklist);

            // get list of available categories
            const categories = Category.list().filter(category => {
                return !blacklist.includes(category);
            });

            // mark already selected categories as checked
            categories.forEach(function(category) {
                category.checked = this.selection.includes(category.id);
            });

            this.set('categories', categories);
        }
    },

    actions: {
        onChange() {
            // update list of selected categories
            this.set(
                'selection',
                this.categories
                    .filter(function(category) {
                        return category.checked;
                    })
                    .map(function(category) {
                        return category.id;
                    })
            );
        }
    }
});
