export default {
    resource: 'preferences.index',
    path: '/u/:username/preferences',
    map() {
        this.route('mailing-lists');
    }
};
