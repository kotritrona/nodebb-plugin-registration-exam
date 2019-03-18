<div class="row">
	<div class="col-sm-9 col-xs-12">
		<p class="lead">
			Question Settings
        </p>
        <div class="exam-admin-below-lead">
            Two inputs are question and answer, textarea for choices, leave choices blank for a blank-filling question.<br />
            regex: use RegExp for answer checking, uncased: ignore case<br />
            multi: multiselect, ignores other flags. use <code>|</code> to connect all correct answers.
        </div>
        <div class="form-group exam-admin-questions">
            <!-- BEGIN questions -->
            <div class="exam-admin-question">
                <div class="row">
                    <div class="col-md-7 col-xs-12">
                        <input type="text" class="form-control exam-admin-q" placeholder="Question?" value="{questions.q}" />
                        <input type="text" class="form-control exam-admin-a" placeholder="Answer" value="{questions.a}" />
                        <a href="javascript:void(0)" class="exam-admin-dupe">duplicate</a>
                        <a href="javascript:void(0)" class="exam-admin-remove">remove</a>
                    </div>
                    <div class="col-md-3 col-xs-12">
                        <textarea class="form-control exam-admin-c">{questions.c}</textarea>
                    </div>
                    <div class="col-md-2 col-xs-12">
                        <div class="checkbox">
                            <label for="exam-admin-r-{questions.n}" class="exam-admin-r-label">
                                <input type="checkbox" class="exam-admin-r"
                                <!-- IF questions.r --> checked="checked" <!-- ENDIF questions.r -->
                                       id="exam-admin-r-{questions.n}" name="exam-admin-r-{questions.n}" />
                                regex
                            </label>
                        </div>
                        <div class="checkbox">
                            <label for="exam-admin-m-{questions.n}" class="exam-admin-m-label">
                                <input type="checkbox" class="exam-admin-m"
                                <!-- IF questions.m --> checked="checked" <!-- ENDIF questions.m -->
                                       id="exam-admin-m-{questions.n}" name="exam-admin-m-{questions.n}" />
                                multi
                            </label>
                        </div>
                        <div class="checkbox">
                            <label for="exam-admin-i-{questions.n}" class="exam-admin-i-label">
                                <input type="checkbox" class="exam-admin-i"
                                <!-- IF questions.i --> checked="checked" <!-- ENDIF questions.i -->
                                       id="exam-admin-i-{questions.n}" name="exam-admin-i-{questions.n}" />
                                uncased
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END questions -->
        </div>
        <div class="exam-admin-add-wrapper">
            <button type="button" id="exam-admin-add" class="exam-admin-add btn btn-primary">Add Question</button>
            <button type="button" class="exam-admin-import btn btn-primary">Import</button>
            <button type="button" class="exam-admin-export btn btn-primary">Export</button>
        </div>
        <div class="exam-admin-hidden-region">
            <input type="file" class="exam-admin-hidden-fileinput" value="" />
            <a href="#" class="exam-admin-hidden-link"></a>
        </div>
	</div>
    <div class="col-sm-3 col-xs-12 settings-header">
        <form role="form" class="exam-settings">
            <div>Numeral Settings</div>
            <hr />
            <div class="form-group">
                <label for="timeLimit">
                    Time Limit
                </label>
                <input class="form-control" type="text" name="timeLimit" id="timeLimit" value="{timeLimit}" />
                <input class="form-control" type="hidden" name="extraTime" id="extraTime" value="{extraTime}" />
            </div>
            <div class="form-group">
                <label for="qCount">
                    Question Count
                </label>
                <input class="form-control" type="text" name="qCount" id="qCount" value="{qCount}" />
            </div>
            <div class="form-group">
                <label for="eachScore">
                    Each question score
                </label>
                <input class="form-control" type="text" name="eachScore" id="eachScore" value="{eachScore}" />
            </div>
            <div class="form-group">
                <label for="needScore">
                    Required score
                </label>
                <input class="form-control" type="text" name="needScore" id="needScore" value="{needScore}" />
            </div>
            <div class="form-group">
                <label for="inviExpire">
                    Invitation Expire (hrs)
                </label>
                <input class="form-control" type="text" name="inviExpire" id="inviExpire" value="{inviExpire}" />
            </div>
            <div class="form-group">
                <label for="ipDayLimit">
                    Daily submission limit (0 === disable)
                </label>
                <input class="form-control" type="text" name="ipDayLimit" id="ipDayLimit" value="{ipDayLimit}" />
            </div>
            <input class="form-control" type="hidden" name="questionsStr" id="questionsStr" value="" />
        </form>
    </div>
</div>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>