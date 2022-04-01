import {Children, Vnode} from 'mithril';
import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Post from 'flarum/common/models/Post';
import icon from 'flarum/common/helpers/icon';

const translationPrefix = 'clarkwinkelmann-colorful-borders.forum.';

interface EditorAttrs extends ComponentAttrs {
    resource: Post
}

export default class Editor extends Component<EditorAttrs> {
    loading: boolean = false;

    option(key: string, styleKey: string, children: Children) {
        return [
            m('.ColorfulBorders-Title', app.translator.trans(translationPrefix + key)),
            m('.ColorfulBorders-Option', [
                m('label', [
                    m('input', {
                        type: 'radio',
                        checked: this.getStyle(styleKey) === null,
                        onchange: () => {
                            this.setStyle(styleKey, null);
                        },
                    }),
                    ' ',
                    app.translator.trans(translationPrefix + 'default'),
                ]),
                children,
            ]),
        ];
    }

    colorOption(key: string, styleKey: string) {
        const colors = app.forum.attribute('colorful-borders.' + key + 's');

        return this.option(key, styleKey, Array.isArray(colors) ? m('.ColorfulBorders-Option-Control', colors.map(color => m('.ColorfulBorders-ColorChoice', {
            style: {
                backgroundColor: color,
            },
            onclick: () => {
                this.setStyle(styleKey, color);
            },
            className: this.getStyle(styleKey) === color ? 'selected' : '',
        }))) : m('input.ColorfulBorders-Option-Control', {
            type: 'color',
            value: this.getStyle(styleKey),
            onchange: (event: Event) => {
                this.setStyle(styleKey, (event.target as HTMLInputElement).value);
            },
        }));
    }

    rangeOption(key: string) {
        const min = app.forum.attribute('colorful-borders.' + key + 'Min');
        const max = app.forum.attribute('colorful-borders.' + key + 'Max');

        // If there's a single option, we show it as a radio button
        if (min === max) {
            return this.option(key, key, m('label.ColorfulBorders-Option-Control', [
                m('input', {
                    type: 'radio',
                    checked: this.getStyle(key) === (min + 'px'),
                    onchange: () => {
                        this.setStyle(key, min + 'px');
                    },
                }),
                ' ' + min + 'px',
            ]));
        }

        return this.option(key, key, m('input.ColorfulBorders-Option-Control', {
            type: 'range',
            min,
            max,
            value: parseInt(this.getStyle(key)), // parseInt() will remove the "px" suffix
            oninput: (event: Event) => {
                this.setStyle(key, (event.target as HTMLInputElement).value + 'px');
            },
        }));
    }

    view() {
        return m('.Dropdown.ColorfulBorders', [
            m('a.Dropdown-toggle', {
                'data-toggle': 'dropdown',
            }, [
                icon('fas fa-palette'),
                ' ',
                app.translator.trans(translationPrefix + 'edit'),
            ]),
            m('.Dropdown-menu', {
                onclick(event: Event) {
                    // Prevent dropdown closing on click
                    event.stopPropagation();
                    event.redraw = false;
                }
            }, [
                app.forum.attribute('colorful-borders.enableBorderColor') ? this.colorOption('borderColor', 'borderColor') : null,
                app.forum.attribute('colorful-borders.enableBackgroundColor') ? this.colorOption('backgroundColor', 'backgroundColor') : null,
                app.forum.attribute('colorful-borders.enableTextColor') ? this.colorOption('textColor', 'color') : null,
                app.forum.attribute('colorful-borders.enableBorderWidth') ? this.rangeOption('borderWidth') : null,
                app.forum.attribute('colorful-borders.enableBorderRadius') ? this.rangeOption('borderRadius') : null,
                Button.component({
                    className: 'Button Button--primary Button--block',
                    disabled: !this.isDirty(),
                    loading: this.loading,
                    onclick: () => {
                        this.loading = true;

                        this.attrs.resource.save({
                            colorfulBordersStyle: this.attrs.resource.attribute('colorfulBordersStyle'),
                        }).then(() => {
                            this.loading = false;
                            m.redraw();
                            this.$('.Dropdown-toggle').dropdown('toggle');
                        }).catch(e => {
                            this.loading = false;
                            throw e;
                        });
                    },
                }, app.translator.trans(translationPrefix + 'apply')),
                Button.component({
                    className: 'Button Button--block',
                    disabled: this.attrs.resource.attribute('savedColorfulBordersStyle') === null,
                    loading: this.loading,
                    onclick: () => {
                        this.loading = true;

                        this.attrs.resource.save({
                            colorfulBordersStyle: null,
                        }).then(() => {
                            this.loading = false;
                            m.redraw();
                            this.$('.Dropdown-toggle').dropdown('toggle');
                        }).catch(e => {
                            this.loading = false;
                            throw e;
                        });
                    },
                }, app.translator.trans(translationPrefix + 'reset')),
            ]),
        ]);
    }

    isDirty() {
        return JSON.stringify(this.attrs.resource.data.attributes.colorfulBordersStyle) !== JSON.stringify(this.attrs.resource.data.attributes.savedColorfulBordersStyle);
    }

    oncreate(vnode: Vnode) {
        super.oncreate(vnode);

        this.$().on('hide.bs.dropdown', () => {
            // Restore previous style
            if (this.isDirty()) {
                this.attrs.resource.data.attributes.colorfulBordersStyle = this.attrs.resource.data.attributes.savedColorfulBordersStyle;
                m.redraw();
            }
        });
    }

    getStyle(key: string) {
        const style: any = this.attrs.resource.attribute('colorfulBordersStyle');

        if (!style) {
            return null;
        }

        if (!style.hasOwnProperty(key)) {
            return null;
        }

        return style[key];
    }

    setStyle(key: string, value: string | null) {
        let style: any = this.attrs.resource.attribute('colorfulBordersStyle');

        if (!style) {
            style = {};
        }

        if (value === null) {
            delete style[key];
        } else {
            style[key] = value;
        }

        // We don't use .pushAttributes() because that would also update the saved copy
        // But we only want to store the value temporarily to have a live preview
        this.attrs.resource.data.attributes.colorfulBordersStyle = style;
    }
}
