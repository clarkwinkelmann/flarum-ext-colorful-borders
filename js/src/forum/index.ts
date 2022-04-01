import app from 'flarum/forum/app';
import saveOriginalStyling from './saveOriginalStyling';
import stylePosts from './stylePosts';

app.initializers.add('clarkwinkelmann-colorful-borders', () => {
    saveOriginalStyling();
    stylePosts();
});
