import Component from "@ember/component";
import Category from 'discourse/models/category';
import { makeArray } from "discourse-common/lib/helpers";

export default Component.extend({
    selection: null,
    blacklist: null,
    categories: null,

    init() {
        this._super(...arguments);

        if (!this.selection) this.set('selection', []);
        if (!this.blacklist) this.set('blacklist', []);
        if (!this.categories) {
            const blacklist = makeArray(this.blacklist);

            // get list of available categories (exclude any blacklisted or uncategorized)
            const categories = Category.list().filter(category => {
                return category.id !== 1 && !blacklist.includes(category);
            });

            const sortedCategories = [];

            // mark already selected categories as checked and sort them in the right order
            categories.forEach(function(category) {
                category.checked = this.selection.any(function(selectedCategory) {
                    return selectedCategory.id === category.id;
                });

                if (category.parent_category_id) {
                    // add it after the parent category
                    var parentOrSibling = sortedCategories.reverse().find(function(s) {
                        return s.parent_category_id === category.parent_category_id || s.id === category.parent_category_id;
                    });

                    sortedCategories.reverse();

                    var i = sortedCategories.indexOf(parentOrSibling);

                    sortedCategories.splice(i + 1, 0, category);
                } else {
                    // check if a child category already exists and add it before it
                    var child = sortedCategories.find(function(s) {
                        return s.parent_category_id === category.id;
                    });

                    if (child) {
                        var i = sortedCategories.indexOf(child);

                        sortedCategories.splice(Math.max(i - 1, 0), 0, category);
                    } else {
                        // just add it
                        sortedCategories.push(category);
                    }
                }
            }, this);

            this.set('categories', sortedCategories);
        }
    },

    actions: {
        onChange: (_this, changedCategory) => {
            // change the checked status of the current category
            changedCategory.checked = !changedCategory.checked;

            // check if changed category has sub-categories and either check or uncheck all of them
            if (changedCategory.subcategories) {
                changedCategory.subcategories.forEach(function(category) {
                    category.set('checked', changedCategory.checked);
                });
            }

            // update list of selected categories
            _this.set(
                'selection',
                _this.categories.filter(function(category) {
                    return category.checked;
                })
            );
        }
    }
});
