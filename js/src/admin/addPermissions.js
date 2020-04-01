import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import ItemList from 'flarum/utils/ItemList';

const translationPrefix = 'clarkwinkelmann-colorful-borders.admin.permissions.';

export default function () {
    extend(PermissionGrid.prototype, 'permissionItems', permissionGroups => {
        const items = new ItemList();

        items.add('edit-own-post', {
            icon: 'fas fa-palette',
            label: app.translator.trans(translationPrefix + 'editOwnPost'),
            permission: 'colorful-borders.editOwnPost',
        });

        items.add('edit-any-post', {
            icon: 'fas fa-palette',
            label: app.translator.trans(translationPrefix + 'editAnyPost'),
            permission: 'colorful-borders.editAnyPost',
            allowGuest: true,
        });

        permissionGroups.add('clarkwinkelmann-colorful-borders', {
            label: app.translator.trans(translationPrefix + 'heading'),
            children: items.toArray()
        });
    });
}
