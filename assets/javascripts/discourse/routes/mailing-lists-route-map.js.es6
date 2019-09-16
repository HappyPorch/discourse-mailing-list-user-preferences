export default {
    resource: 'preferences',
    path: '/u/:username/preferences/mailing-lists',
    map() {
        this.route('mailing-lists');
    }
};
