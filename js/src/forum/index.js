import {extend} from 'flarum/extend';
import app from 'flarum/app';
import saveOriginalStyling from './saveOriginalStyling';
import stylePosts from './stylePosts';

app.initializers.add('clarkwinkelmann-colorful-borders', () => {
    saveOriginalStyling();
    stylePosts();
});
