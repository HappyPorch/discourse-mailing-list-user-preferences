import Category from 'discourse/models/category';

export default Ember.Component.extend({
    categories: null,
    blacklist: null,

    init() {
        this._super(...arguments);

        if (!this.categories) this.set('categories', []);
        if (!this.blacklist) this.set('blacklist', []);
    },

    computeValues() {
        return Ember.makeArray(this.categories).map(c => c.id);
    },

    mutateValues(values) {
        this.set('categories', values.map(v => Category.findById(v)));
    },

    filterComputedContent(computedContent, computedValues, filter) {
        const regex = new RegExp(filter, 'i');
        return computedContent.filter(category => this._normalize(Ember.get(category, 'name')).match(regex));
    },

    computeContent() {
        const blacklist = Ember.makeArray(this.blacklist);
        return Category.list().filter(category => {
            return this.categories.includes(category) || !blacklist.includes(category);
        });
    }
});
