import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface NDAClausePreviewProps {
  subLevel: 1 | 2 | 3;
  userAnswers: { [key: string]: any };
  isDarkMode: boolean;
  highlightedTexts?: string[]; // Optional: texts that user highlighted in the game
}

const NDAClausePreview: React.FC<NDAClausePreviewProps> = ({
  subLevel,
  userAnswers,
  isDarkMode,
  highlightedTexts = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Demo fallback values - ONLY used when user hasn't completed questionnaire
  // These are placeholder values to show how the feature works
  // Real implementation will use actual user answers from the questionnaire
  const demoAnswers = {
    recipientName: "TechCorp Ltd",
    recipientAddress: "123 Business Street, London",
    discloserName: "Innovate Solutions Inc",
    discloserAddress: "456 Innovation Avenue, New York",
    purpose: "discussing the possibility of entering into a joint venture",
    agreementDate: "2024-01-15",
    employeesAdvisersDisclosure: true,
    durationIndefinite: true,
    durationYears: 5,
  };

  // Get clause content based on sub-level and what user highlighted
  const getClauseContent = () => {
    if (subLevel === 1) {
      // Placeholders - show clause based on what user highlighted
      return getDynamicPlaceholderClause();
    } else if (subLevel === 2) {
      // Small Conditions - show clause based on what user highlighted/found
      return getDynamicSmallConditionsClause();
    } else if (subLevel === 3) {
      // Big Conditions - show clause based on what user highlighted/found
      return getDynamicBigConditionsClause();
    }
    return null;
  };

  // Dynamically determine which placeholder clause to show based on highlighted texts
  const getDynamicPlaceholderClause = () => {
    console.log("NDAClausePreview - highlightedTexts:", highlightedTexts);
    
    // Check what placeholders the user highlighted (exact matches or contains)
    const hasRecipientInfo = highlightedTexts.some(text => 
      text === "Name of Individual or Company Receiving Information" || 
      text === "Recipient Name" ||
      text.toLowerCase().includes("recipient name") ||
      text.toLowerCase().includes("recipient") && text.toLowerCase().includes("name")
    );
    
    const hasDiscloserInfo = highlightedTexts.some(text => 
      text === "Name of Individual or Company Disclosing Information" || 
      text === "Discloser Name" ||
      text.toLowerCase().includes("discloser name") ||
      text.toLowerCase().includes("discloser") && text.toLowerCase().includes("name")
    );
    
    const hasPurpose = highlightedTexts.some(text => 
      text === "Purpose" ||
      text.toLowerCase().includes("purpose") ||
      text.toLowerCase().includes("joint venture") ||
      text.toLowerCase().includes("disclosure purpose")
    );
    
    const hasDate = highlightedTexts.some(text => 
      text === "Agreement Date" ||
      text === "YYYY-DD-MM" ||
      text.toLowerCase().includes("agreement date") ||
      text.toLowerCase().includes("date")
    );

    console.log("NDAClausePreview - Detection results:", {
      hasRecipientInfo,
      hasDiscloserInfo,
      hasPurpose,
      hasDate
    });

    // Prioritize showing the most relevant clause
    if (hasRecipientInfo || hasDiscloserInfo) {
      console.log("NDAClausePreview - Showing PARTIES clause");
      return {
        title: "PARTIES Clause",
        before: `Recipient: [Name of Individual or Company Receiving Information], residing at [Address of Individual (Recipient)] ("Recipient").

Discloser: [Name of Individual or Company Disclosing Information], residing at [Address of Individual (Discloser)] ("Discloser").`,
        after: renderPartiesClause(),
      };
    } else if (hasPurpose) {
      console.log("NDAClausePreview - Showing PURPOSE clause");
      return {
        title: "PURPOSE Clause",
        before: `The Discloser intends to disclose information (the Confidential Information) to the Recipient for the purpose of [insert details e.g. discussing the possibility of the Recipient and the Discloser entering into a joint venture] (the Purpose).`,
        after: renderPurposeClause(),
      };
    } else if (hasDate) {
      console.log("NDAClausePreview - Showing DATE clause");
      return {
        title: "DATE Clause",
        before: `Date: [YYYY-DD-MM]`,
        after: renderDateClause(),
      };
    }

    // Default fallback - show PARTIES clause
    console.log("NDAClausePreview - Showing PARTIES clause (fallback)");
    return {
      title: "PARTIES Clause (Example)",
      before: `Recipient: [Name of Individual or Company Receiving Information], residing at [Address of Individual (Recipient)] ("Recipient").

Discloser: [Name of Individual or Company Disclosing Information], residing at [Address of Individual (Discloser)] ("Discloser").`,
      after: renderPartiesClause(),
    };
  };

  // Render placeholders with user/demo values
  const renderPartiesClause = () => {
    // Try multiple possible keys for each field
    const recipientName = 
      userAnswers["What's the name of the recipient?"] || 
      userAnswers["Recipient Name"] ||
      demoAnswers.recipientName;
      
    const recipientAddress = 
      userAnswers["What's the recipient's address?"] || 
      userAnswers["Recipient Address"] ||
      demoAnswers.recipientAddress;
      
    const discloserName = 
      userAnswers["What's the name of the discloser?"] || 
      userAnswers["Discloser Name"] ||
      demoAnswers.discloserName;
      
    const discloserAddress = 
      userAnswers["What's the discloser's address?"] || 
      userAnswers["Discloser Address"] ||
      demoAnswers.discloserAddress;

    return (
      <div className="space-y-3">
        <p>
          Recipient: <span className={highlightClass}>{recipientName}</span>, residing at{" "}
          <span className={highlightClass}>{recipientAddress}</span> ("Recipient").
        </p>
        <p>
          Discloser: <span className={highlightClass}>{discloserName}</span>, residing at{" "}
          <span className={highlightClass}>{discloserAddress}</span> ("Discloser").
        </p>
      </div>
    );
  };

  const renderPurposeClause = () => {
    const purpose = userAnswers["What's the purpose of the disclosure?"] || 
                    userAnswers["What is the purpose of the disclosure?"] ||
                    demoAnswers.purpose;

    return (
      <div>
        <p>
          The Discloser intends to disclose information (the Confidential Information) to the Recipient for the purpose of{" "}
          <span className={highlightClass}>{purpose}</span> (the Purpose).
        </p>
      </div>
    );
  };

  const renderDateClause = () => {
    const date = userAnswers["What's the agreement date?"] || 
                 userAnswers["Agreement Date"] || 
                 demoAnswers.agreementDate;

    return (
      <div>
        <p>
          Date: <span className={highlightClass}>{date}</span>
        </p>
      </div>
    );
  };

  // Dynamically determine which small conditions clause to show based on highlighted texts
  const getDynamicSmallConditionsClause = () => {
    console.log("NDAClausePreview - highlightedTexts for small conditions:", highlightedTexts);
    
    // Check what small conditions the user found/highlighted
    const hasEmployeesAdvisers = highlightedTexts.some(text => 
      text.toLowerCase().includes("employees and professional advisers") ||
      text.toLowerCase().includes("except to its employees") ||
      text.toLowerCase().includes("employees or advisers") ||
      text === "except to its employees and professional advisers who need to know the same for the Purpose, who know they owe a duty of confidence to the Discloser and who are bound by obligations equivalent to those in this clause 2 above and this clause 3"
    );

    console.log("NDAClausePreview - Small conditions detection:", {
      hasEmployeesAdvisers
    });

    // Build the "before" template based on what was found
    let beforeClause = "";
    let title = "Small Conditions Clause";
    
    if (hasEmployeesAdvisers) {
      title = "NON-DISCLOSURE OBLIGATION Clause";
      beforeClause = `The Recipient undertakes to keep the Confidential Information secure and not to disclose it to any third party {except to its employees and professional advisers who need to know the same for the Purpose, who know they owe a duty of confidence to the Discloser and who are bound by obligations equivalent to those in this clause 2 above and this clause 3}.`;
    } else {
      // Default fallback
      title = "NON-DISCLOSURE OBLIGATION Clause";
      beforeClause = `The Recipient undertakes to keep the Confidential Information secure and not to disclose it to any third party {except to its employees and professional advisers who need to know the same for the Purpose, who know they owe a duty of confidence to the Discloser and who are bound by obligations equivalent to those in this clause 2 above and this clause 3}.`;
    }

    return {
      title,
      before: beforeClause,
      after: renderSmallConditions(),
    };
  };

  // Render small conditions based on boolean values
  const renderSmallConditions = () => {
    const employeesAdvisersEnabled =
      userAnswers["Can the Recipient disclose the Confidential Information to employees or advisers?"] ??
      demoAnswers.employeesAdvisersDisclosure;

    return (
      <div className="space-y-4">
        {employeesAdvisersEnabled ? (
          <p className={`${highlightClass} p-2 rounded`}>
            ✓ The Recipient undertakes to keep the Confidential Information secure and not to disclose it to any third party except to its employees and professional advisers who need to know the same for the Purpose, who know they owe a duty of confidence to the Discloser and who are bound by obligations equivalent to those in this clause 2 above and this clause 3.
          </p>
        ) : (
          <p className={`${highlightClass} p-2 rounded`}>
            ✓ The Recipient undertakes to keep the Confidential Information secure and not to disclose it to any third party.
          </p>
        )}
      </div>
    );
  };

  // Dynamically determine which big conditions clause to show based on highlighted texts
  const getDynamicBigConditionsClause = () => {
    console.log("NDAClausePreview - highlightedTexts for big conditions:", highlightedTexts);
    
    // Check what big conditions the user found/highlighted
    const hasDuration = highlightedTexts.some(text => 
      text.toLowerCase().includes("duration of obligations") ||
      text.toLowerCase().includes("continue in force") ||
      text.toLowerCase().includes("indefinitely") ||
      text.toLowerCase().includes("years from the date")
    );

    console.log("NDAClausePreview - Big conditions detection:", {
      hasDuration
    });

    // Build the "before" template based on what was found
    let beforeClause = "";
    let title = "Big Conditions Clause";
    
    if (hasDuration) {
      title = "DURATION OF OBLIGATIONS Clause";
      beforeClause = `(DURATION OF OBLIGATIONS

The undertakings above will continue in force ([Indefinitely] [for [Insert number] years from the date of this Agreement]).)

Note: When "Yes" is selected, sub-questions appear:
"Should they apply indefinitely?"
"For how many years should the obligations last?" (if "No" to indefinite)`;
    } else {
      // Default fallback
      title = "DURATION OF OBLIGATIONS Clause";
      beforeClause = `(DURATION OF OBLIGATIONS

The undertakings above will continue in force ([Indefinitely] [for [Insert number] years from the date of this Agreement]).)

Note: When "Yes" is selected, sub-questions appear:
"Should they apply indefinitely?"
"For how many years should the obligations last?" (if "No" to indefinite)`;
    }

    return {
      title,
      before: beforeClause,
      after: renderBigConditions(),
    };
  };

  // Render big conditions (entire block present/absent)
  const renderBigConditions = () => {
    const durationEnabled =
      userAnswers["Should the confidentiality obligations apply?"] ??
      true;
    
    const indefinitelyEnabled =
      userAnswers["Should they apply indefinitely?"] ??
      demoAnswers.durationIndefinite;
    
    const durationYears =
      userAnswers["How many years should the obligations last?"] ||
      userAnswers["For how many years should they apply?"] ||
      demoAnswers.durationYears;

    if (durationEnabled) {
      return (
        <div className={`${highlightClass} p-3 rounded`}>
          <h3 className="font-bold mb-2">✓ DURATION OF OBLIGATIONS</h3>
          <p className="mb-3">
            The undertakings above will continue in force{" "}
            {indefinitelyEnabled ? (
              <span className="font-semibold">indefinitely</span>
            ) : (
              <span className="font-semibold">for {durationYears} years from the date of this Agreement</span>
            )}.
          </p>
          
          {/* Sub-questions for Duration */}
          <div className={`mt-4 pt-4 border-t ${
            isDarkMode ? "border-teal-700/30" : "border-teal-300/30"
          }`}>
            <p className={`text-sm font-semibold mb-2 ${
              isDarkMode ? "text-teal-200" : "text-teal-800"
            }`}>
              Sub-questions:
            </p>
            <div className="space-y-3">
              <div>
                <p className={`text-sm mb-1 ${
                  isDarkMode ? "text-teal-100" : "text-teal-900"
                }`}>
                  Should they apply indefinitely?
                </p>
                {userAnswers["Should they apply indefinitely?"] !== undefined ? (
                  <div className={`p-2 rounded ${
                    isDarkMode 
                      ? "bg-teal-700/30 border border-teal-600/30" 
                      : "bg-teal-100/50 border border-teal-300/30"
                  }`}>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? "text-teal-200" : "text-teal-800"
                    }`}>
                      ✓ Answer: {indefinitelyEnabled ? "Yes" : "No"}
                    </p>
                  </div>
                ) : (
                  <div className={`p-2 rounded border-2 border-dashed ${
                    isDarkMode 
                      ? "bg-gray-800/30 border-gray-600/50" 
                      : "bg-gray-100/50 border-gray-300/50"
                  }`}>
                    <p className={`text-xs italic ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      (This sub-question appears when "Yes" is selected. Answer it in the questionnaire to see the value here.)
                    </p>
                  </div>
                )}
              </div>
              
              {!indefinitelyEnabled && (
                <div>
                  <p className={`text-sm mb-1 ${
                    isDarkMode ? "text-teal-100" : "text-teal-900"
                  }`}>
                    How many years should the obligations last?
                  </p>
                  {(userAnswers["How many years should the obligations last?"] || userAnswers["For how many years should they apply?"]) ? (
                    <div className={`p-2 rounded ${
                      isDarkMode 
                        ? "bg-teal-700/30 border border-teal-600/30" 
                        : "bg-teal-100/50 border border-teal-300/30"
                    }`}>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? "text-teal-200" : "text-teal-800"
                      }`}>
                        ✓ Answer: {userAnswers["How many years should the obligations last?"] || userAnswers["For how many years should they apply?"] || durationYears} years
                      </p>
                    </div>
                  ) : (
                    <div className={`p-2 rounded border-2 border-dashed ${
                      isDarkMode 
                        ? "bg-gray-800/30 border-gray-600/50" 
                        : "bg-gray-100/50 border-gray-300/50"
                    }`}>
                      <p className={`text-xs italic ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        (This sub-question appears when "No" is selected for indefinite. Answer it in the questionnaire to see the value here.)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-gray-500">
          <p className="line-through">DURATION OF OBLIGATIONS clause not included</p>
          <p className="text-sm mt-2 italic">
            (The entire DURATION OF OBLIGATIONS section is removed when the condition is false)
          </p>
        </div>
      );
    }
  };

  const highlightClass = isDarkMode
    ? "bg-teal-600/30 text-teal-100 font-medium"
    : "bg-teal-200/50 text-teal-900 font-medium";

  const clauseContent = getClauseContent();
  if (!clauseContent) return null;

  return (
    <div
      className={`my-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-teal-600/40 shadow-lg shadow-teal-900/20"
          : "bg-gradient-to-br from-white/90 to-teal-50/30 border-teal-400/40 shadow-lg shadow-teal-500/10"
      }`}
    >
      {/* Decorative gradient overlay */}
      <div className={`absolute inset-0 opacity-5 pointer-events-none ${
        isDarkMode ? "bg-gradient-to-br from-teal-400 to-cyan-600" : "bg-gradient-to-br from-teal-300 to-cyan-400"
      }`}></div>

      {/* Collapsible Header */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("NDAClausePreview button clicked, current state:", isExpanded);
          setIsExpanded(!isExpanded);
        }}
        className={`relative w-full px-6 py-5 flex items-center justify-between transition-all duration-300 cursor-pointer group ${
          isDarkMode
            ? "hover:bg-teal-900/20 text-teal-100 active:bg-teal-900/30"
            : "hover:bg-teal-100/30 text-teal-900 active:bg-teal-100/50"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Icon with pulse effect */}
          <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
            isDarkMode 
              ? "bg-teal-600/30 group-hover:bg-teal-600/50" 
              : "bg-teal-500/20 group-hover:bg-teal-500/30"
          }`}>
            <span className="text-2xl">📄</span>
            {!isExpanded && (
              <span className="absolute inset-0 rounded-xl bg-teal-400/20 animate-ping"></span>
            )}
          </div>
          
          <div className="text-left">
            <span className={`font-bold text-base block ${
              isDarkMode ? "text-teal-200" : "text-teal-800"
            }`}>
              See it in a real contract clause
            </span>
            <span className={`text-xs ${
              isDarkMode ? "text-teal-400/70" : "text-teal-600/70"
            }`}>
              {isExpanded ? "Click to collapse" : "Click to expand"}
            </span>
          </div>
        </div>
        
        {/* Animated chevron */}
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
          isDarkMode 
            ? "bg-teal-700/30 group-hover:bg-teal-700/50" 
            : "bg-teal-400/20 group-hover:bg-teal-400/30"
        }`}>
          <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            <FaChevronDown className={isDarkMode ? "text-teal-300" : "text-teal-700"} />
          </span>
        </div>
      </button>

      {/* Expandable Content with slide animation */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 animate-fadeIn">
          {/* Clause title with badge */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDarkMode 
                ? "bg-teal-600/30 text-teal-200 border border-teal-500/30" 
                : "bg-teal-500/20 text-teal-700 border border-teal-400/30"
            }`}>
              {clauseContent.title}
            </div>
            <div className={`h-px flex-1 ${isDarkMode ? "bg-teal-700/30" : "bg-teal-300/30"}`}></div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Before Panel - Full Width */}
            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-900/60 border-gray-700/50 hover:border-gray-600/70 shadow-lg"
                  : "bg-gray-50/80 border-gray-300/50 hover:border-gray-400/70 shadow-md"
              }`}
            >
              {/* Corner decoration */}
              <div className={`absolute top-0 left-0 w-16 h-16 rounded-tl-xl opacity-10 ${
                isDarkMode ? "bg-gradient-to-br from-gray-400" : "bg-gradient-to-br from-gray-600"
              }`}></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDarkMode ? "bg-gray-400" : "bg-gray-600"
                  }`}></div>
                  <h4
                    className={`text-sm font-black uppercase tracking-widest ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    • BEFORE (TEMPLATE)
                  </h4>
                </div>
                <div
                  className={`text-sm leading-loose whitespace-pre-line font-mono ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {clauseContent.before}
                </div>
              </div>
            </div>

            {/* After Panel - Full Width with gradient */}
            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-teal-900/30 to-cyan-900/20 border-teal-600/50 hover:border-teal-500/70 shadow-lg shadow-teal-900/20"
                  : "bg-gradient-to-br from-teal-50/80 to-cyan-50/60 border-teal-300/50 hover:border-teal-400/70 shadow-md shadow-teal-500/10"
              }`}
            >
              {/* Corner decoration */}
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-tr-xl opacity-10 ${
                isDarkMode ? "bg-gradient-to-bl from-teal-400" : "bg-gradient-to-bl from-teal-600"
              }`}></div>
              
              {/* Sparkle effect */}
              <div className="absolute top-4 right-4 text-yellow-400 text-lg animate-pulse">✨</div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDarkMode ? "bg-teal-400" : "bg-teal-600"
                  }`}></div>
                  <h4
                    className={`text-sm font-black uppercase tracking-widest ${
                      isDarkMode ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    • AFTER (WITH YOUR AUTOMATION)
                  </h4>
                </div>
                <div
                  className={`text-sm leading-loose ${
                    isDarkMode ? "text-teal-100" : "text-teal-900"
                  }`}
                >
                  {clauseContent.after}
                </div>
              </div>
            </div>
          </div>

          {/* Info Footer - Enhanced */}
          <div
            className={`mt-5 pt-4 border-t flex items-center gap-3 ${
              isDarkMode ? "border-teal-700/30" : "border-teal-300/30"
            }`}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
              Object.keys(userAnswers).length > 0
                ? isDarkMode ? "bg-green-600/30 text-green-400" : "bg-green-500/20 text-green-600"
                : isDarkMode ? "bg-blue-600/30 text-blue-400" : "bg-blue-500/20 text-blue-600"
            }`}>
              {Object.keys(userAnswers).length > 0 ? "✓" : "ℹ"}
            </div>
            <span
              className={`text-xs italic ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {Object.keys(userAnswers).length > 0
                ? "Using your questionnaire answers"
                : "Using demo values (complete the questionnaire to see your data)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NDAClausePreview;
