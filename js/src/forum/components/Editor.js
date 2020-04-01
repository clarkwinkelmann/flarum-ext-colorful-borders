import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import icon from 'flarum/helpers/icon';

/* global m */

const translationPrefix = 'clarkwinkelmann-colorful-borders.forum.';

export default class Editor extends Component {
    init() {
        this.loading = false;
    }

    option(key, styleKey, children) {
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

    colorOption(key, styleKey) {
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
            onchange: e => {
                this.setStyle(styleKey, e.target.value);
            },
        }));
    }

    rangeOption(key) {
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
            oninput: e => {
                this.setStyle(key, e.target.value + 'px');
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
                // Using config and not onclick so we don't trigger unnecessary Mithril redraws
                config(element, isInitialized) {
                    if (isInitialized) return;

                    element.addEventListener('click', event => event.stopPropagation());
                },
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

                        this.props.resource.save({
                            colorfulBordersStyle: this.props.resource.attribute('colorfulBordersStyle'),
                        }).then(() => {
                            this.loading = false;
                            m.redraw();
                            this.$('.Dropdown-toggle').dropdown('toggle');
                        }).catch(e => {
                            this.loading = false;
                            throw e;
                        });
                    },
                    children: app.translator.trans(translationPrefix + 'apply'),
                }),
                Button.component({
                    className: 'Button Button--block',
                    disabled: this.props.resource.attribute('savedColorfulBordersStyle') === null,
                    loading: this.loading,
                    onclick: () => {
                        this.loading = true;

                        this.props.resource.save({
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
                    children: app.translator.trans(translationPrefix + 'reset'),
                }),
            ]),
        ]);
    }

    isDirty() {
        return JSON.stringify(this.props.resource.data.attributes.colorfulBordersStyle) !== JSON.stringify(this.props.resource.data.attributes.savedColorfulBordersStyle);
    }

    config(isInitialized) {
        if (isInitialized) return;

        this.$().on('hide.bs.dropdown', () => {
            // Restore previous style
            if (this.isDirty()) {
                this.props.resource.data.attributes.colorfulBordersStyle = this.props.resource.data.attributes.savedColorfulBordersStyle;
                m.redraw();
            }
        });
    }

    getStyle(key) {
        const style = this.props.resource.attribute('colorfulBordersStyle');

        if (!style) {
            return null;
        }

        if (!style.hasOwnProperty(key)) {
            return null;
        }

        return style[key];
    }

    setStyle(key, value) {
        let style = this.props.resource.attribute('colorfulBordersStyle');

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
        this.props.resource.data.attributes.colorfulBordersStyle = style;
    }
}
