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

            // get list of available categories (exclude any blacklisted or uncategorized)
            const categories = Category.list().filter(category => {
                return category.id !== 1 && !blacklist.includes(category);
            });

            // mark already selected categories as checked
            categories.forEach(function(category) {
                category.checked = this.selection.any(function(selectedCategory) {
                    return selectedCategory.id === category.id;
                });
            }, this);

            this.set('categories', categories);
        }
    },

    actions: {
        onChange(changedCategory, e) {
            let isChecked = e.target.checked;
            changedCategory = isChecked;

            // check if changed category has sub-categories and either check or uncheck all of them
            if (changedCategory.subcategories) {
                changedCategory.subcategories.forEach(function(category) {
                    category.checked = changedCategory.checked;
                });
            }

            // update list of selected categories
            this.set(
                'selection',
                this.categories.filter(function(category) {
                    return category.checked;
                })
            );
        }
    }
});
