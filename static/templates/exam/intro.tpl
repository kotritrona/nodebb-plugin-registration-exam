<div class="exam-intro">
    <div class="row"><h3>[[exam:banner]]</h3></div>
    <div class="row">[[exam:duration]] <strong>{timeMinutes}</strong> [[exam:minutes]]</div>
    <div class="row">[[exam:total-score]] <strong>{maxScore}</strong></div>
    <div class="row">[[exam:need-score-front]] <strong>{needScore}</strong> [[exam:need-score-end]]</div>
    <div class="row">
        <div id="exam-start" class="exam-start btn btn-primary">
            [[exam:begin-exam]]
        </div>
    </div>
</div>
<div class="exam-timer row">
    [[exam:timer-front]] <span class="exam-timer-number">80</span> [[exam:timer-end]]
</div>
<div class="exam-questions-debug"></div>
<div class="exam-error alert alert-danger"></div>
<div class="exam-form-container row">
    <!-- IMPORT exam/form.tpl -->
</div>
<div class="exam-result">
    <div class="exam-score-line">[[exam:score]] <span class="exam-score-number">0</span></div>
    <div class="exam-passed">[[exam:passed]]</div>
    <div class="exam-failed">[[exam:failed]]</div>
    <div class="exam-invitation">[[exam:invitation]] <span class="exam-invitation-code">00000000</span></div>
    <div class="exam-timeup">[[exam:timeup]]</div>
</div>
<div class="exam-errors">
    {error}
</div>