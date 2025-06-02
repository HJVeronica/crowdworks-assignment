export function JsonDataPanel() {
  return (
    <div className="w-1/2 flex flex-col">
      {/* 컨텐츠 영역 */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-800 leading-relaxed">
              The Board of Directors of SK networks, as the highest
              decision-making body of the company, makes business plans and
              decides on major issues of the company, including climate change
              issues, and supervises the execution of the duties of the
              management. In order to advance the ESG management system, SK
              networks has established the 'ESG Management Committee' in March
              2021, in which all Board members have participated since May 2022.
              The ESG Management Committee independently and objectively
              deliberates on various climate-related issues when making major
              decisions that may have a significant impact on management
              strategies, and looks into major climate change-related policies
              and to enhance...
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">
                Board Agenda on Climate Change Response for 2023
              </h3>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-800">
                      Session(Date held)
                    </th>
                    <th className="text-left py-2 text-gray-800">Agenda</th>
                    <th className="text-left py-2 text-gray-800">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">4th Session(May 08)</td>
                    <td className="py-2 text-gray-800">
                      Establishment of CEO KPI for 2023
                    </td>
                    <td className="py-2 text-gray-800">
                      Reflecting greenhouse gas emissions and the Group's ESG
                      Key indicators
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">10th Session(Dec 08)</td>
                    <td className="py-2 text-gray-800">
                      Participation in capital increase by SK electlink
                    </td>
                    <td className="py-2 text-gray-800">
                      Contributing to greenhouse gas reduction through expansion
                      of EV charging infrastructure
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Strengthening Ability to Respond to Climate Change
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed">
              SK networks operates various educational programs and workshops to
              help independent directors raise their expertise in ESG. We are
              actively supporting the Board members to raise their sensitivity
              to climate-related issues and ensure that their expertise is
              reflected in the decision-making process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
