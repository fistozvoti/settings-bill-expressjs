const assert = require('assert');

const SettingsBillFactory = require('../Settings-Bill-Factory');


describe('settings-bill', function () {

    var settingsBill = SettingsBillFactory();

    it('should be able to keep record of calls made', function () {
        settingsBill.setSettings({
            callCost: 0,
            smsCost: 0,
            warningLevel: 0,
            criticalLevel: 10
        });
        // settingsBill.keepRecordOfAction('call');
        // settingsBill.keepRecordOfAction('call');
        // settingsBill.keepRecordOfAction('call');
        settingsBill.keepRecordOfAction('call');
        
        assert.equal(1, settingsBill.getActionsFor("call").length);
    });
    it('should be able to keep record of SMSs made', function () {
        settingsBill.setSettings({
            callCost: 0,
            smsCost: 0,
            warningLevel: 0,
            criticalLevel: 10
        });
        // settingsBill.keepRecordOfAction('sms');
        // settingsBill.keepRecordOfAction('sms');
        // settingsBill.keepRecordOfAction('sms');
        settingsBill.keepRecordOfAction('sms');
        
        assert.equal(1, settingsBill.getActionsFor("call").length);
    });
    it('should allow the user to set the settings', function () {
        settingsBill.setSettings({
            callCost: 2.00,
            smsCost: 1.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        assert.deepEqual({
            callCost: 2.00,
            smsCost: 1.00,
            warningLevel: 5,
            criticalLevel: 10
        }, settingsBill.getSettings())
    });
    it('should be able to calculate the grandtotal', function () {
        const settingsBill = SettingsBillFactory();
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 2.00,
            warningLevel: 10,
            criticalLevel: 15
        });

        settingsBill.keepRecordOfAction('call');
        settingsBill.keepRecordOfAction('sms');

        assert.equal(1.50, settingsBill.forTotals().smsTotal);
        assert.equal(2.00, settingsBill.forTotals().callTotal);
        assert.equal(3.50, settingsBill.forTotals().grandTotal);

    });
    it('should be to calculate the totals for multiple of actions', function () {
        const settingsBill = SettingsBillFactory();
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 5.00,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.keepRecordOfAction('call');
        settingsBill.keepRecordOfAction('call');
        settingsBill.keepRecordOfAction('sms');
        settingsBill.keepRecordOfAction('sms');

        assert.equal(3.00, settingsBill.forTotals().smsTotal);
        assert.equal(10.00, settingsBill.forTotals().callTotal);
        assert.equal(13.00, settingsBill.forTotals().grandTotal);

    });
    it('should be able to recognize if the actions have met the warning level', function () {
        const settingsBill = SettingsBillFactory();
        settingsBill.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10
        });

        settingsBill.keepRecordOfAction('call');
        settingsBill.keepRecordOfAction('sms');

        assert.equal(true, settingsBill.getWarningLevel());
    });
    it('should be able to recognize if the actions have met the critical level', function () {
        const settingsBill = SettingsBillFactory();
        settingsBill.setSettings({
            smsCost: 1.50,
            callCost: 2.00,
            warningLevel: 4,
            criticalLevel: 5
        });

        settingsBill.keepRecordOfAction('call');
        settingsBill.keepRecordOfAction('call');
        settingsBill.keepRecordOfAction('sms');

        assert.equal(true, settingsBill.getCriticalLevel());
    });
});