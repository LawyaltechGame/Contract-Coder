import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ClausePreviewProps {
  subLevel: 1 | 2 | 3;
  userAnswers: { [key: string]: any };
  isDarkMode: boolean;
  highlightedTexts?: string[]; // Optional: texts that user highlighted in the game
}

const ClausePreview: React.FC<ClausePreviewProps> = ({
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
    employerName: "Acme Ltd",
    registeredAddress: "10 Downing Street, London",
    employeeName: "Jordan Patel",
    employeeAddress: "Lucknow, India",
    overtimeEligible: true,
    additionalDuties: true,
    pensionEnabled: false,
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
    console.log("ClausePreview - highlightedTexts:", highlightedTexts);
    
    // Check what placeholders the user highlighted (exact matches or contains)
    const hasEmployerInfo = highlightedTexts.some(text => 
      text === "Employer Name" || 
      text === "Registered Address" ||
      text.toLowerCase().includes("employer") ||
      text.toLowerCase().includes("registered address")
    );
    
    const hasEmployeeInfo = highlightedTexts.some(text => 
      text === "Employee Name" || 
      text === "Employee Address" ||
      text.toLowerCase().includes("employee name") ||
      text.toLowerCase().includes("employee address")
    );
    
    const hasSalary = highlightedTexts.some(text => 
      text === "Annual Salary" ||
      text.toLowerCase().includes("annual salary") ||
      text.toLowerCase().includes("salary")
    );
    
    const hasJobTitle = highlightedTexts.some(text => 
      text === "Job Title" ||
      text.toLowerCase().includes("job title")
    );
    
    const hasStartDate = highlightedTexts.some(text => 
      text === "Start Date" ||
      text.toLowerCase().includes("start date")
    );

    console.log("ClausePreview - Detection results:", {
      hasEmployerInfo,
      hasEmployeeInfo,
      hasSalary,
      hasJobTitle,
      hasStartDate
    });

    // Prioritize showing the most relevant clause
    if (hasEmployerInfo || hasEmployeeInfo) {
      console.log("ClausePreview - Showing PARTIES clause");
      return {
        title: "PARTIES Clause",
        before: `Employer: [Employer Name], a company incorporated and registered in [Registered Address], United Kingdom ("Company").

Employee: [Employee Name], residing at [Employee Address] ("Employee").`,
        after: renderPartiesClause(),
      };
    } else if (hasSalary) {
      console.log("ClausePreview - Showing SALARY clause");
      return {
        title: "SALARY Clause",
        before: `The Employee shall receive an annual salary of [Annual Salary] [USD], payable in equal monthly installments.`,
        after: renderSalaryClause(),
      };
    } else if (hasJobTitle) {
      console.log("ClausePreview - Showing JOB TITLE clause");
      return {
        title: "JOB TITLE AND DUTIES Clause",
        before: `The Employee is employed in the position of [Job Title]. The Employee's duties shall include responsibilities appropriate to this role.`,
        after: renderJobTitleClause(),
      };
    } else if (hasStartDate) {
      console.log("ClausePreview - Showing COMMENCEMENT clause");
      return {
        title: "COMMENCEMENT Clause",
        before: `This employment shall commence on [Start Date] and shall continue until terminated by either party.`,
        after: renderStartDateClause(),
      };
    }

    // Default fallback - show PARTIES clause
    console.log("ClausePreview - Showing PARTIES clause (fallback)");
    return {
      title: "PARTIES Clause (Example)",
      before: `Employer: [Employer Name], a company incorporated and registered in [Registered Address], United Kingdom ("Company").

Employee: [Employee Name], residing at [Employee Address] ("Employee").`,
      after: renderPartiesClause(),
    };
  };

  // Render placeholders with user/demo values
  const renderPartiesClause = () => {
    // Try multiple possible keys for each field
    const employerName = 
      userAnswers["Employer Name"] || 
      userAnswers["What's the name of the employer?"] || 
      userAnswers["What's the employer name?"] ||
      demoAnswers.employerName;
      
    const registeredAddress = 
      userAnswers["Registered Address"] || 
      userAnswers["What's the registered address?"] || 
      userAnswers["What's the address of the company?"] ||
      demoAnswers.registeredAddress;
      
    const employeeName = 
      userAnswers["Employee Name"] || 
      userAnswers["What's the name of the employee?"] || 
      userAnswers["What's the employee name?"] ||
      demoAnswers.employeeName;
      
    const employeeAddress = 
      userAnswers["Employee Address"] || 
      userAnswers["What's the employee's address?"] || 
      userAnswers["What's the employee address?"] ||
      demoAnswers.employeeAddress;

    console.log("ClausePreview - renderPartiesClause data:", {
      employerName,
      registeredAddress,
      employeeName,
      employeeAddress,
      userAnswersKeys: Object.keys(userAnswers)
    });

    return (
      <div className="space-y-3">
        <p>
          Employer: <span className={highlightClass}>{employerName}</span>, a company incorporated and registered in{" "}
          <span className={highlightClass}>{registeredAddress}</span>, United Kingdom ("Company").
        </p>
        <p>
          Employee: <span className={highlightClass}>{employeeName}</span>, residing at{" "}
          <span className={highlightClass}>{employeeAddress}</span> ("Employee").
        </p>
      </div>
    );
  };

  const renderSalaryClause = () => {
    const salary = userAnswers["What's the annual salary?"];
    const salaryAmount = salary?.amount || "50000";
    const currency = salary?.currency || "USD";

    return (
      <div>
        <p>
          The Employee shall receive an annual salary of{" "}
          <span className={highlightClass}>{salaryAmount}</span>{" "}
          <span className={highlightClass}>{currency}</span>, payable in equal monthly installments.
        </p>
      </div>
    );
  };

  const renderJobTitleClause = () => {
    const jobTitle = userAnswers["What's the name of the job title?"] || userAnswers["Job Title"] || "Software Engineer";

    return (
      <div>
        <p>
          The Employee is employed in the position of{" "}
          <span className={highlightClass}>{jobTitle}</span>. The Employee's duties shall include responsibilities appropriate to this role.
        </p>
      </div>
    );
  };

  const renderStartDateClause = () => {
    const startDate = userAnswers["What's the start date?"] || userAnswers["Start Date"] || "2024-01-01";

    return (
      <div>
        <p>
          This employment shall commence on{" "}
          <span className={highlightClass}>{startDate}</span> and shall continue until terminated by either party.
        </p>
      </div>
    );
  };

  // Dynamically determine which small conditions clause to show based on highlighted texts
  const getDynamicSmallConditionsClause = () => {
    console.log("ClausePreview - highlightedTexts for small conditions:", highlightedTexts);
    
    // Check what small conditions the user found/highlighted
    const hasAdditionalDuties = highlightedTexts.some(text => 
      text.toLowerCase().includes("additional duties") ||
      text.toLowerCase().includes("perform additional duties") ||
      text === "The Employee may be required to perform additional duties as reasonably assigned by the Company."
    );
    
    const hasOvertimeYes = highlightedTexts.some(text => 
      text.toLowerCase().includes("entitled to overtime pay") ||
      text.toLowerCase().includes("overtime pay for authorized") ||
      text === "The Employee is entitled to overtime pay for authorized overtime work."
    );
    
    const hasOvertimeNo = highlightedTexts.some(text => 
      text.toLowerCase().includes("shall not receive additional payment for overtime") ||
      text.toLowerCase().includes("not receive additional payment for overtime worked") ||
      text === "The Employee shall not receive additional payment for overtime worked."
    );
    
    const hasOtherLocations = highlightedTexts.some(text => 
      text.toLowerCase().includes("other locations") ||
      text.toLowerCase().includes("work at additional locations")
    );
    
    const hasPreviousService = highlightedTexts.some(text => 
      text.toLowerCase().includes("previous service") ||
      text.toLowerCase().includes("previous employment start date")
    );

    console.log("ClausePreview - Small conditions detection:", {
      hasAdditionalDuties,
      hasOvertimeYes,
      hasOvertimeNo,
      hasOtherLocations,
      hasPreviousService
    });

    // Build the "before" template based on what was found
    let beforeClause = "";
    let title = "Small Conditions Clauses";
    
    // Prioritize showing clauses based on what was found
    if (hasAdditionalDuties || hasOvertimeYes || hasOvertimeNo) {
      title = "Additional Duties & Overtime Clauses";
      beforeClause = `{The Employee may be required to perform additional duties as reasonably assigned by the Company.}

OR

{The Employee shall not receive additional payment for overtime worked.}
{The Employee is entitled to overtime pay for authorized overtime work.}`;
    } else if (hasOtherLocations) {
      title = "Additional Locations Clause";
      beforeClause = `{The Employee may be required to work at [other locations].}

Note: When "Yes" is selected, a sub-question appears:
"What is the additional work location?"`;
    } else if (hasPreviousService) {
      title = "Previous Service Clause";
      beforeClause = `{or, if applicable, "on Previous Employment Start Date with previous continuous service taken into account"}`;
    } else {
      // Default fallback - show Additional Duties & Overtime
      title = "Additional Duties & Overtime Clauses";
      beforeClause = `{The Employee may be required to perform additional duties as reasonably assigned by the Company.}

OR

{The Employee shall not receive additional payment for overtime worked.}
{The Employee is entitled to overtime pay for authorized overtime work.}`;
    }

    return {
      title,
      before: beforeClause,
      after: renderSmallConditions(),
    };
  };

  // Render small conditions based on boolean values
  const renderSmallConditions = () => {
    const additionalDuties =
      userAnswers["Is the Employee required to perform additional duties as part of their employment?"] ??
      demoAnswers.additionalDuties;
    const overtimeEligible =
      userAnswers["Is the employee entitled to overtime work?"] ??
      demoAnswers.overtimeEligible;
    
    // Check if other locations condition was found
    const hasOtherLocations = highlightedTexts.some(text => 
      text.toLowerCase().includes("other locations") ||
      text.toLowerCase().includes("work at additional locations")
    );
    
    const otherLocationsAnswer = userAnswers["Does the employee need to work at additional locations besides the normal place of work?"];
    
    // Check if previous service condition was found
    const hasPreviousService = highlightedTexts.some(text => 
      text.toLowerCase().includes("previous service") ||
      text.toLowerCase().includes("previous employment start date")
    );
    
    const previousServiceAnswer = userAnswers["Is the previous service applicable?"];

    return (
      <div className="space-y-4">
        {/* Additional Duties Condition */}
        {(highlightedTexts.some(text => text.toLowerCase().includes("additional duties")) || 
          highlightedTexts.length === 0) && (
          <>
            {additionalDuties ? (
              <p className={`${highlightClass} p-2 rounded`}>
                ✓ The Employee may be required to perform additional duties as reasonably assigned by the Company.
              </p>
            ) : (
              <p className="text-gray-500 line-through">
                The Employee may be required to perform additional duties as reasonably assigned by the Company.
              </p>
            )}
          </>
        )}
        
        {/* Overtime Conditions */}
        {(highlightedTexts.some(text => 
          text.toLowerCase().includes("overtime") || 
          text.toLowerCase().includes("additional payment for overtime")) || 
          highlightedTexts.length === 0) && (
          <div className="border-t pt-2 mt-2">
            <p className="text-sm font-semibold mb-2">Overtime Pay (one option shown):</p>
            {overtimeEligible ? (
              <p className={`${highlightClass} p-2 rounded`}>
                ✓ The Employee is entitled to overtime pay for authorized overtime work.
              </p>
            ) : (
              <p className={`${highlightClass} p-2 rounded`}>
                ✓ The Employee shall not receive additional payment for overtime worked.
              </p>
            )}
          </div>
        )}
        
        {/* Other Locations Condition */}
        {hasOtherLocations && (
          <div className="border-t pt-2 mt-2">
            <p className="text-sm font-semibold mb-2">Additional Locations:</p>
            {otherLocationsAnswer === true ? (
              <>
                <p className={`${highlightClass} p-2 rounded mb-3`}>
                  ✓ The Employee may be required to work at{" "}
                  <span className="font-semibold">
                    {userAnswers["What is the additional work location?"] 
                      ? userAnswers["What is the additional work location?"]
                      : "[other locations]"}
                  </span>.
                </p>
                
                {/* Sub-question for Additional Work Location */}
                <div className={`mt-3 pt-3 border-t ${
                  isDarkMode ? "border-teal-700/30" : "border-teal-300/30"
                }`}>
                  <p className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-teal-200" : "text-teal-800"
                  }`}>
                    Sub-question:
                  </p>
                  <div className="space-y-2">
                    <p className={`text-sm ${
                      isDarkMode ? "text-teal-100" : "text-teal-900"
                    }`}>
                      What is the additional work location?
                    </p>
                    {userAnswers["What is the additional work location?"] ? (
                      <div className={`p-2 rounded ${
                        isDarkMode 
                          ? "bg-teal-700/30 border border-teal-600/30" 
                          : "bg-teal-100/50 border border-teal-300/30"
                      }`}>
                        <p className={`text-sm font-medium ${
                          isDarkMode ? "text-teal-200" : "text-teal-800"
                        }`}>
                          ✓ Answer: {userAnswers["What is the additional work location?"]}
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
                </div>
              </>
            ) : (
              <p className="text-gray-500 line-through">
                The Employee may be required to work at other locations.
              </p>
            )}
          </div>
        )}
        
        {/* Previous Service Condition */}
        {hasPreviousService && (
          <div className="border-t pt-2 mt-2">
            <p className="text-sm font-semibold mb-2">Previous Service:</p>
            {previousServiceAnswer === true ? (
              <p className={`${highlightClass} p-2 rounded`}>
                ✓ or, if applicable, "on Previous Employment Start Date with previous continuous service taken into account"
              </p>
            ) : (
              <p className="text-gray-500 line-through">
                or, if applicable, "on Previous Employment Start Date with previous continuous service taken into account"
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Dynamically determine which big conditions clause to show based on highlighted texts
  const getDynamicBigConditionsClause = () => {
    console.log("ClausePreview - highlightedTexts for big conditions:", highlightedTexts);
    
    // Check what big conditions the user found/highlighted
    const hasProbationary = highlightedTexts.some(text => 
      text.toLowerCase().includes("probationary") ||
      text.toLowerCase().includes("probation period") ||
      text.toLowerCase().includes("probation period length") ||
      text === "The first Probation Period Length of employment will be a probationary period. The Company shall assess the Employee's performance and suitability during this time. Upon successful completion, the Employee will be confirmed in their role."
    );
    
    const hasPension = highlightedTexts.some(text => 
      text.toLowerCase().includes("pension") ||
      text.toLowerCase().includes("workplace pension scheme") ||
      text.toLowerCase().includes("pensions act") ||
      text === "The Employee will be enrolled in the Company's workplace pension scheme in accordance with the Pensions Act 2008. Contributions will be made as required under auto-enrolment legislation."
    );

    console.log("ClausePreview - Big conditions detection:", {
      hasProbationary,
      hasPension
    });

    // Build the "before" template based on what was found
    let beforeClause = "";
    let title = "Big Conditions Clause";
    
    // Prioritize showing clauses based on what was found
    if (hasProbationary && hasPension) {
      // Both found - show the one that was found first or prioritize probationary
      title = "PROBATIONARY PERIOD & PENSION Clauses";
      beforeClause = `(PROBATIONARY PERIOD

The first [Probation Period Length] months of employment will be a probationary period. The Company shall assess the Employee's performance and suitability during this time. Upon successful completion, the Employee will be confirmed in their role.)

Note: When "Yes" is selected, a sub-question appears:
"What's the probation period length?"

(PENSION

The Company will enroll the Employee in a workplace pension scheme in accordance with applicable law. Contributions will be made as per statutory requirements.)`;
    } else if (hasProbationary) {
      title = "PROBATIONARY PERIOD Clause";
      beforeClause = `(PROBATIONARY PERIOD

The first [Probation Period Length] months of employment will be a probationary period. The Company shall assess the Employee's performance and suitability during this time. Upon successful completion, the Employee will be confirmed in their role.)

Note: When "Yes" is selected, a sub-question appears:
"What's the probation period length?"`;
    } else if (hasPension) {
      title = "PENSION Clause";
      beforeClause = `(PENSION

The Company will enroll the Employee in a workplace pension scheme in accordance with applicable law. Contributions will be made as per statutory requirements.)`;
    } else {
      // Default fallback - show PENSION clause
      title = "PENSION Clause";
      beforeClause = `(PENSION

The Company will enroll the Employee in a workplace pension scheme in accordance with applicable law. Contributions will be made as per statutory requirements.)`;
    }

    return {
      title,
      before: beforeClause,
      after: renderBigConditions(),
    };
  };

  // Render big conditions (entire block present/absent)
  const renderBigConditions = () => {
    // Check which big conditions were found
    const hasProbationary = highlightedTexts.some(text => 
      text.toLowerCase().includes("probationary") ||
      text.toLowerCase().includes("probation period") ||
      text.toLowerCase().includes("probation period length")
    );
    
    const hasPension = highlightedTexts.some(text => 
      text.toLowerCase().includes("pension") ||
      text.toLowerCase().includes("workplace pension scheme") ||
      text.toLowerCase().includes("pensions act")
    );
    
    const probationaryEnabled =
      userAnswers["Is the clause of probationary period applicable?"] ??
      false;
    
    const pensionEnabled =
      userAnswers["Is the Pension clause applicable?"] ??
      demoAnswers.pensionEnabled;

    return (
      <div className="space-y-4">
        {/* Probationary Period Condition */}
        {(hasProbationary || highlightedTexts.length === 0) && (
          <div>
            {probationaryEnabled ? (
              <div className={`${highlightClass} p-3 rounded`}>
                <h3 className="font-bold mb-2">✓ PROBATIONARY PERIOD</h3>
                <p className="mb-4">
                  The first{" "}
                  <span className="font-semibold">
                    {userAnswers["What's the probation period length?"] 
                      ? `${userAnswers["What's the probation period length?"]} months`
                      : "[Probation Period Length] months"}
                  </span>{" "}
                  of employment will be a probationary period. 
                  The Company shall assess the Employee's performance and suitability during this time. 
                  Upon successful completion, the Employee will be confirmed in their role.
                </p>
                
                {/* Sub-question for Probation Period Length */}
                <div className={`mt-4 pt-4 border-t ${
                  isDarkMode ? "border-teal-700/30" : "border-teal-300/30"
                }`}>
                  <p className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-teal-200" : "text-teal-800"
                  }`}>
                    Sub-question:
                  </p>
                  <div className="space-y-2">
                    <p className={`text-sm ${
                      isDarkMode ? "text-teal-100" : "text-teal-900"
                    }`}>
                      What's the probation period length?
                    </p>
                    {userAnswers["What's the probation period length?"] ? (
                      <div className={`p-2 rounded ${
                        isDarkMode 
                          ? "bg-teal-700/30 border border-teal-600/30" 
                          : "bg-teal-100/50 border border-teal-300/30"
                      }`}>
                        <p className={`text-sm font-medium ${
                          isDarkMode ? "text-teal-200" : "text-teal-800"
                        }`}>
                          ✓ Answer: {userAnswers["What's the probation period length?"]} months
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
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="line-through">PROBATIONARY PERIOD clause not included</p>
                <p className="text-sm mt-2 italic">
                  (The entire PROBATIONARY PERIOD section is removed when the condition is false)
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Pension Condition */}
        {(hasPension || highlightedTexts.length === 0) && (
          <div className={hasProbationary && hasPension ? "border-t pt-4 mt-4" : ""}>
            {pensionEnabled ? (
              <div className={`${highlightClass} p-3 rounded`}>
                <h3 className="font-bold mb-2">✓ PENSION</h3>
                <p>
                  The Company will enroll the Employee in a workplace pension scheme in accordance with applicable law.
                  Contributions will be made as per statutory requirements.
                </p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="line-through">PENSION clause not included</p>
                <p className="text-sm mt-2 italic">
                  (The entire PENSION section is removed when the condition is false)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
          console.log("ClausePreview button clicked, current state:", isExpanded);
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
                    Before (Template)
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
                    After (With your automation)
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

export default ClausePreview;
