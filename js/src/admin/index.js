import {extend} from 'flarum/extend';
import app from 'flarum/app';
import SettingsModal from './components/SettingsModal';
import addPermissions from './addPermissions';

app.initializers.add('clarkwinkelmann-colorful-borders', () => {
    app.extensionSettings['clarkwinkelmann-colorful-borders'] = () => app.modal.show(new SettingsModal());

    addPermissions();
});
