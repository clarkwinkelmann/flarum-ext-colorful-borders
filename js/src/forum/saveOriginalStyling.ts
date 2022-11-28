import {extend} from 'flarum/common/extend';
import Model, {ModelData} from 'flarum/common/Model';
import Store from 'flarum/common/Store';

function checkAndSave(data: ModelData | undefined, record: Model) {
    // We only save when the colorfulBordersStyle attribute is present alone
    // If the savedColorfulBordersStyle properly is present it must mean an error occurred and Model.save()
    // is restoring the old attributes. When this happens we want to keep the old saved value as well so we skip this
    if (data && data.attributes && data.attributes.hasOwnProperty('colorfulBordersStyle') && !data.attributes.hasOwnProperty('savedColorfulBordersStyle')) {
        record.data.attributes!.savedColorfulBordersStyle = JSON.parse(JSON.stringify(data.attributes.colorfulBordersStyle));
    }
}

/**
 * Save a copy of the data so we can restore it when leaving the editor without saving
 * We need to extend both Store.createRecord and Model.pushData to cover all situations
 * where the data is loaded from the database or updated after saving
 */
export default function () {
    extend(Store.prototype, 'createRecord', function (record, type, data) {
        checkAndSave(data, record);
    });

    extend(Model.prototype, 'pushData', function (returned, data) {
        checkAndSave(data as ModelData, this);
    });
}
