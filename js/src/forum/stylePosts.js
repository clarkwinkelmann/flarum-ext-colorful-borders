import {extend} from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost';
import Editor from './components/Editor';

export default function () {
    extend(CommentPost.prototype, 'headerItems', function (items) {
        if (this.props.post.attribute('canEditColorfulBordersStyle')) {
            items.add('colorful-borders', Editor.component({
                resource: this.props.post,
            }));
        }
    });

    extend(CommentPost.prototype, 'init', function () {
        this.subtree.check(() => JSON.stringify(this.props.post.attribute('colorfulBordersStyle')));
    });

    extend(CommentPost.prototype, 'attrs', function (attrs) {
        const style = this.props.post.attribute('colorfulBordersStyle');

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
