'use strict';
/* globals $, app, socket */

define('admin/plugins/exam', ['settings'], function(Settings) {

	var ACP = {};

	// yarimasune!
	function getRandomID() {
		return Math.floor(Math.random() * 1145141919).toString(36);
	}

	// make sure the <label> and <input>s pair up
    // also resets the event for duplicate & remove links
	function setQuestionID(baseElem, id) {
		["r", "m", "i"].forEach(lt => {
			let u = baseElem.find(".exam-admin-" + lt), idStr = "exam-admin-" + lt + "-" + id;
			u.attr("id", idStr)
			 .attr("name", idStr);

			let label = baseElem.find(".exam-admin-" + lt + "-label");
			label.attr("for", idStr);

			let dup = baseElem.find(".exam-admin-dupe");
			dup.off("click")
			   .click(dupeQuestion.bind(null, baseElem));

			let rem = baseElem.find(".exam-admin-remove");
			rem.off("click")
			   .click(removeQuestionWithCare.bind(null, baseElem));
		});
	}

	// add, dupe and remove questions in admin page
	function addQuestion() {
		let baseElem = $(".exam-admin-question").eq(0).clone();
		let id = getRandomID();
		["q", "a", "c"].forEach(lt => baseElem.find(".exam-admin-" + lt).val(""));
		["r", "m", "i"].forEach(lt => {
			let u = baseElem.find(".exam-admin-" + lt);
			u.prop("checked", false);
		});
		setQuestionID(baseElem, id);
		$(".exam-admin-questions").append(baseElem);
		baseElem.hide().show(400);
	}

	function dupeQuestion(elem) {
		let baseElem = $(elem).clone();
		let id = getRandomID();
		setQuestionID(baseElem, id);
		baseElem.insertAfter($(elem));
		baseElem.hide().show(400);
	}

    // if you remove the last question there will be nothing to copy from
    // use this to avoid removing everything
    function removeQuestionWithCare(elem) {
        if($(".exam-admin-question").length <= 1) {
            return;
        }
        removeQuestion(elem);
    }

	function removeQuestion(elem) {
		$(elem).hide(400, function() {
			$(this).remove();
		});
	}

	function addEvents() {
		$(".exam-admin-add").click(addQuestion);
        $(".exam-admin-import").click(loadSettingsButton);
        $(".exam-admin-export").click(saveSettings);
        $(".exam-admin-hidden-fileinput").on("change", loadSettingsFileChange);
		let questions = ajaxify.data.questions;
		$(".exam-admin-question").each((i, elem) => {
			$(elem).find(".exam-admin-dupe").click(dupeQuestion.bind(null, elem));
			$(elem).find(".exam-admin-remove").click(removeQuestionWithCare.bind(null, elem));
		});
	}

	function calculateQuestionStr() {
		// save the "question" part to a hidden input inside the form
		// the length varies, so it is better to preprocess it here.
		// the "n" will be set to its order in the array while originally being random IDs.
		let question = $(".exam-admin-question").map((i, elem) => {
			return {
                "q": $(elem).find(".exam-admin-q").val(),
                "a": $(elem).find(".exam-admin-a").val(),
                "c": $(elem).find(".exam-admin-c").val().split(/\r?\n/).filter(s => s.length > 0),
                "n": i,
                "m": $(elem).find(".exam-admin-m").prop("checked"),
                "r": $(elem).find(".exam-admin-r").prop("checked"),
                "i": $(elem).find(".exam-admin-i").prop("checked")
			}
		});
		return JSON.stringify(question.toArray());
	}

    function saveSettings() {
        let q = JSON.parse(calculateQuestionStr()), u = $('.exam-settings').serializeObject();
        let s = { "questions" : q };
        ["timeLimit", "extraTime", "qCount", "eachScore", "needScore", "inviExpire", "ipDayLimit"].forEach(tag => {
            s[tag] = parseInt(u[tag], 10) || 0;
        });

        // save the file
        const jsonData = JSON.stringify(s, null, 2);
        const blob = new Blob([jsonData], { "type" : "application/json" });
        let a = $(".exam-admin-hidden-link")[0];
        a.href = URL.createObjectURL(blob);
        a.download = "exam-settings.json";
        a.click();
    }

    // add, dupe and remove questions in admin page
    function addQuestionWithData(baseElem, question) {
        ["q", "a"].forEach(lt => baseElem.find(".exam-admin-" + lt).val(question[lt]));

        baseElem.find(".exam-admin-c").val(question.c.join("\n"));

        ["r", "m", "i"].forEach(lt => {
            let u = baseElem.find(".exam-admin-" + lt);
            u.prop("checked", question[lt]);
        });
        setQuestionID(baseElem, question.n);
        $(".exam-admin-questions").append(baseElem);
        baseElem.hide().show(400);
    }

    function loadSettingsButton() {
        $(".exam-admin-hidden-fileinput").click();
    }

    function loadSettingsFileChange() {
        let reader = new FileReader();
        reader.onload = () => {
            let settings = JSON.parse(reader.result);
            loadSettings(settings);
        };
        reader.readAsText($(".exam-admin-hidden-fileinput")[0].files[0]);
    }

    function loadSettings(settings) {
        console.log(settings);
        if(!settings.questions) {
            return;
        }
        let baseElem = $(".exam-admin-question").eq(0).clone();

        // remove all questions
        $(".exam-admin-question").remove();

        // add new questions using the new data
        settings.questions.forEach(question => {
            addQuestionWithData(baseElem.clone(), question);
        });

        // update numeral fields
        ["timeLimit", "extraTime", "qCount", "eachScore", "needScore", "inviExpire", "ipDayLimit"].forEach(tag => {
            $(".exam-settings #" + tag).val(settings[tag]);
        });
    }

	ACP.init = function() {

		// we have already loaded our settings in the template, so no need to do it here
		// Settings.load('exam', $('.exam-settings'));
		addEvents();

		$('#save').on('click', function() {
			$('#questionsStr').val(calculateQuestionStr());
			Settings.save('registration-exam', $('.exam-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'registration-exam-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});
