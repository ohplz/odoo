/** @odoo-module **/

import ActivityMenu from '@mail/js/systray/systray_activity_menu';
import { start } from '@mail/../tests/helpers/test_utils';

import testUtils from 'web.test_utils';

QUnit.module('note', {}, function () {
QUnit.module("ActivityMenu");

QUnit.test('note activity menu widget: create note from activity menu', async function (assert) {
    assert.expect(15);

    const { widget } = await start();

    const activityMenu = new ActivityMenu(widget);
    await activityMenu.appendTo($('#qunit-fixture'));
    assert.hasClass(activityMenu.$el, 'o_mail_systray_item',
        'should be the instance of widget');
    await testUtils.nextTick();
    assert.strictEqual(activityMenu.$('.o_notification_counter').text(), '0',
        "should not have any activity notification initially");

    // toggle quick create for note
    await testUtils.dom.click(activityMenu.$('.dropdown-toggle'));
    assert.containsOnce(activityMenu, '.o_no_activity',
        "should not have any activity preview");
    assert.doesNotHaveClass(activityMenu.$('.o_note_show'), 'd-none',
        'ActivityMenu should have Add new note CTA');
    await testUtils.dom.click(activityMenu.$('.o_note_show'));
    assert.hasClass(activityMenu.$('.o_note_show'), 'd-none',
        'ActivityMenu should hide CTA when entering a new note');
    assert.doesNotHaveClass(activityMenu.$('.o_note'), 'd-none',
        'ActivityMenu should display input for new note');

    // creating quick note without date
    await testUtils.fields.editInput(activityMenu.$("input.o_note_input"), "New Note");
    await testUtils.dom.click(activityMenu.$(".o_note_save"));
    assert.strictEqual(activityMenu.$('.o_notification_counter').text(), '1',
        "should increment activity notification counter after creating a note");
    assert.containsOnce(activityMenu, '.o_mail_preview[data-res_model="note.note"]',
        "should have an activity preview that is a note");
    assert.strictEqual(activityMenu.$('.o_activity_filter_button[data-filter="today"]').text().trim(),
        "1 Today",
        "should display one note for today");

    assert.doesNotHaveClass(activityMenu.$('.o_note_show'), 'd-none',
        'ActivityMenu add note button should be displayed');
    assert.hasClass(activityMenu.$('.o_note'), 'd-none',
        'ActivityMenu add note input should be hidden');

    // creating quick note with date
    await testUtils.dom.click(activityMenu.$('.o_note_show'));
    activityMenu.$('input.o_note_input').val("New Note");
    await testUtils.dom.click(activityMenu.$(".o_note_save"));
    assert.strictEqual(activityMenu.$('.o_notification_counter').text(), '2',
        "should increment activity notification counter after creating a second note");
    assert.strictEqual(activityMenu.$('.o_activity_filter_button[data-filter="today"]').text().trim(),
        "2 Today",
        "should display 2 notes for today");
    assert.doesNotHaveClass(activityMenu.$('.o_note_show'), 'd-none',
        'ActivityMenu add note button should be displayed');
    assert.hasClass(activityMenu.$('.o_note'), 'd-none',
        'ActivityMenu add note input should be hidden');
    widget.destroy();
});
});
