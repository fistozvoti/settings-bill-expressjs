let moment = require('moment');

module.exports = function SettingsBillFactory() {

    var smsCost;
    var callCost;
    var warningLevel;
    var criticalLevel;

    var listOfActions = [];

    function keepRecordOfAction(data) {
        let totalCost = 0;

        if (!stopCounting()) {
            if (data === 'sms') {
                totalCost += smsCost;
            }
            else if (data === 'call') {
                totalCost += callCost;
            }
        }

        listOfActions.push({
            data,
            totalCost,
            timerecording: moment(new Date()).fromNow()
        });
    }

    function setSettings(settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);
    }

    function getSettings() {

        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function getActionsFor(type) {
        const filteredActions = [];

        for (let i = 0; i < listOfActions.length; i++) {
            const action = listOfActions[i];
            if (action.data === type) {
                filteredActions.push(action);
            }
        }
        return filteredActions;
    }

    function getListOfActions() {
        return listOfActions;
    }

    function getTotal(type) {
        let total = 0;

        for (let i = 0; i < listOfActions.length; i++) {

            const action = listOfActions[i];

            if (action.data === type) {
                total += action.totalCost;
            }
        }
        return total;

    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function forTotals() {
        let smsTotal = getTotal('sms');
        let callTotal = getTotal('call');

        return {
            smsTotal: smsTotal.toFixed(2),
            callTotal: callTotal.toFixed(2),
            grandTotal: grandTotal().toFixed(2)
        }
    }

    function getCriticalLevel() {
        let total = grandTotal();
        return total >= criticalLevel;
    }

    function getWarningLevel() {
        let total = grandTotal();
        let warning = total >= warningLevel
            && total < criticalLevel;

        return warning;
    }

    function stopCounting() {
        return grandTotal() >= criticalLevel
    }

    return {
        forTotals,
        grandTotal,
        setSettings,
        getSettings,
        getActionsFor,
        getWarningLevel,
        getCriticalLevel,
        getListOfActions,
        keepRecordOfAction,
    }
}