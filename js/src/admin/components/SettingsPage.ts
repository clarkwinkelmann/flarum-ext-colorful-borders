import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Switch from 'flarum/common/components/Switch';

const settingsPrefix = 'colorful-borders.';
const translationPrefix = 'clarkwinkelmann-colorful-borders.admin.settings.';

export default class SettingsPage extends ExtensionPage {
    colorOption(enableKey: string, valueKey: string, enabledDefault: string) {
        const value = this.setting(settingsPrefix + valueKey, 'simple')();

        return [
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + enableKey, enabledDefault)() === '1',
                    onchange: (value: boolean) => {
                        this.setting(settingsPrefix + enableKey)(value ? '1' : '0');
                    },
                }, app.translator.trans(translationPrefix + enableKey)),
            ]),
            m('.Form-group.ColorfulBorders-Subgroup', [
                m('label', [
                    m('input', {
                        type: 'radio',
                        name: 'clarkwinkelmann-colorful-borders-' + valueKey,
                        checked: value === 'simple',
                        onchange: () => this.setting(settingsPrefix + valueKey)('simple'),
                    }),
                    ' ',
                    app.translator.trans(translationPrefix + 'colors.simple'),
                ]),
                m('label', [
                    m('input', {
                        type: 'radio',
                        name: 'clarkwinkelmann-colorful-borders-' + valueKey,
                        checked: value === 'all',
                        onchange: () => this.setting(settingsPrefix + valueKey)('all'),
                    }),
                    ' ',
                    app.translator.trans(translationPrefix + 'colors.all'),
                ]),
                m('label', [
                    m('input', {
                        type: 'radio',
                        name: 'clarkwinkelmann-colorful-borders-' + valueKey,
                        checked: value !== 'simple' && value !== 'all',
                        onchange: () => this.setting(settingsPrefix + valueKey)(''),
                    }),
                    ' ',
                    app.translator.trans(translationPrefix + 'colors.custom'),
                ]),
                value !== 'simple' && value !== 'all' ? [
                    m('input.FormControl', {
                        bidi: this.setting(settingsPrefix + valueKey),
                    }),
                    m('.helpText', app.translator.trans(translationPrefix + 'colors.custom-help')),
                ] : null,
            ]),
        ];
    }

    rangeOption(enableKey: string, valueKey: string, placeholderMin: string) {
        return [
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + enableKey, '1')() === '1',
                    onchange: (value: boolean) => {
                        this.setting(settingsPrefix + enableKey)(value ? '1' : '0');
                    },
                }, app.translator.trans(translationPrefix + enableKey)),
            ]),
            m('.Form-group.ColorfulBorders-Subgroup.ColorfulBorders-MinMax', [
                m('div', [
                    m('label', {
                        for: 'clarkwinkelmann-colorful-borders-' + valueKey + '-min',
                    }, app.translator.trans(translationPrefix + 'min')),
                    m('input.FormControl', {
                        type: 'text',
                        id: 'clarkwinkelmann-colorful-borders-' + valueKey + '-min',
                        bidi: this.setting(settingsPrefix + valueKey + 'Min'),
                        placeholder: placeholderMin,
                    }),
                ]),
                m('div', [
                    m('label', {
                        for: 'clarkwinkelmann-colorful-borders-' + valueKey + '-max',
                    }, app.translator.trans(translationPrefix + 'max')),
                    m('input.FormControl', {
                        type: 'text',
                        id: 'clarkwinkelmann-colorful-borders-' + valueKey + '-max',
                        bidi: this.setting(settingsPrefix + valueKey + 'Max'),
                        placeholder: '10',
                    }),
                ]),
            ]),
        ];
    }

    content() {
        return m('.ExtensionPage-settings', m('.container', [
            this.colorOption('enableBorderColor', 'borderColors', '1'),
            this.colorOption('enableBackgroundColor', 'backgroundColors', '0'),
            this.colorOption('enableTextColor', 'textColors', '0'),
            this.rangeOption('enableBorderWidth', 'borderWidth', '1'),
            this.rangeOption('enableBorderRadius', 'borderRadius', '0'),
            m('.Form-group', this.submitButton()),
        ]));
    }
}
