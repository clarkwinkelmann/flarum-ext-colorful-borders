import app from 'flarum/admin/app';
import SettingsPage from './components/SettingsPage';

app.initializers.add('clarkwinkelmann-colorful-borders', () => {
    app.extensionData.for('clarkwinkelmann-colorful-borders')
        .registerPage(SettingsPage)
        .registerPermission({
            icon: 'fas fa-palette',
            label: app.translator.trans('clarkwinkelmann-colorful-borders.admin.permissions.editOwnPost'),
            permission: 'colorful-borders.editOwnPost',
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-palette',
            label: app.translator.trans('clarkwinkelmann-colorful-borders.admin.permissions.editAnyPost'),
            permission: 'colorful-borders.editAnyPost',
            allowGuest: true,
        }, 'reply');
});
