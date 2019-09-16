export default {
    resource: 'preferences',
    path: '/u/:username/preferences',
    map() {
        this.route('mailing-lists');
    }
};
