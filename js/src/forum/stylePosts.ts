import {extend} from 'flarum/common/extend';
import CommentPost from 'flarum/forum/components/CommentPost';
import Editor from './components/Editor';

export default function () {
    extend(CommentPost.prototype, 'headerItems', function (items) {
        if (this.attrs.post.attribute('canEditColorfulBordersStyle')) {
            items.add('colorful-borders', Editor.component({
                resource: this.attrs.post,
            }));
        }
    });

    extend(CommentPost.prototype, 'oninit', function () {
        this.subtree.check(() => JSON.stringify(this.attrs.post.attribute('colorfulBordersStyle')));
    });

    extend(CommentPost.prototype, 'elementAttrs', function (attrs: any) {
        const style = this.attrs.post.attribute<{ [key: string]: string }>('colorfulBordersStyle');

        if (!style) {
            return;
        }

        if (!attrs.style) {
            attrs.style = {};
        }

        Object.keys(style).forEach(key => {
            attrs.style[key] = style[key];
        });
    });
}
