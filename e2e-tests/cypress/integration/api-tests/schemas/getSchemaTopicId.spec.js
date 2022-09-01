import { METHOD, STATUS_CODE } from "../../../support/api/api-const";
import API from "../../../support/ApiUrls";

context("Schemas", () => {
    const authorization = Cypress.env("authorization");

    it("get all schemas by topicid", () => {
    
            cy.sendRequest(METHOD.GET, API.Schemas, { authorization }).then(
                (resp) => {
                    const topicUid = resp.body[0].topicId;
                    cy.sendRequest(METHOD.GET, API.Schemas + topicUid, { authorization },
                        ).then(
                        (resp) => {
                            expect(resp.status).eql(STATUS_CODE.OK);
                            expect(resp.body[0]).to.have.property("id");
                            expect(resp.body[0]).to.have.property("topicId", topicUid);
                        }
                    );
                });
                }
            );
    
});
