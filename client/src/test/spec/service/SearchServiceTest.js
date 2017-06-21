(function () {
    'use strict';

    /**
     * Tests the SearchService. Checks if it's behaviour is correct.
     *
     * @author Estácio Pereira
     */
    describe('SearchServiceTest', function () {

        beforeEach(module('pitonApp', 'stateMock', 'Mocks'));

        var SearchService, NoteMock;
        var self = this;

        beforeEach(inject(defaultInjections(self)));

        beforeEach(inject(function (_SearchService_, _NoteMock_) {
            SearchService = _SearchService_;
            NoteMock = _NoteMock_;
        }));

        describe('addParam should', function () {
            it('correctly add a search parameter to the service', function () {
                var attr = 'active',
                    value = true,
                    isConstraint = true;
                SearchService.addParam(attr, value, isConstraint);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                expect(SearchService.searchParams[attr].value).to.be.equal(value);
                expect(SearchService.searchParams[attr].isConstraint).to.be.equal(isConstraint);
            });

            it('add a constraint as false if no constraint is given', function () {
                var attr = 'active',
                    value = true;
                SearchService.addParam(attr, value);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                expect(SearchService.searchParams[attr].value).to.be.equal(value);
                expect(SearchService.searchParams[attr].isConstraint).to.be.false;
            });
        });

        describe('deleteParam should', function () {
            it('correctly delete a search parameter of the service', function () {
                var attr = 'active',
                    value = true,
                    isConstraint = true;
                SearchService.addParam(attr, value, isConstraint);
                expect(SearchService.searchParams[attr]).to.not.be.empty;
                SearchService.deleteParam(attr);
                expect(SearchService.searchParams[attr]).to.be.undefined;
            });

            it('do nothing if there is no search parameters', function(){
                var attr = 'tags';
                expect(SearchService.searchParams[attr]).to.be.undefined;
                SearchService.deleteParam(attr);
                expect(SearchService.searchParams[attr]).to.be.undefined;
            });
        });

        describe('filter should', function () {
            it('correctly filter the notes given constraints', function () {
                var attr = 'active',
                    value = true,
                    isConstraint = true;
                SearchService.addParam(attr, value, isConstraint);
                expect(SearchService.searchParams[attr]).to.not.be.empty;

                var notes = [NoteMock.get(), NoteMock.get()];
                _.first(notes)[attr] = !value;
                _.last(notes)[attr] = value;

                var filteredNotes = SearchService.filter(notes);
                expect(filteredNotes.length).to.not.be.equal(notes.length);
                expect(_.first(filteredNotes)).to.be.equal(_.last(notes));
            });

            it('correctly filter the notes given more than one constraints', function () {
                var attr1 = 'active',
                    value1 = true,
                    isConstraint1 = true;

                var attr2 = 'tags',
                    value2 = 'tag1',
                    isConstraint2 = true;

                SearchService.addParam(attr1, value1, isConstraint1);
                SearchService.addParam(attr2, value2, isConstraint2);
                expect(SearchService.searchParams[attr1]).to.not.be.empty;
                expect(SearchService.searchParams[attr2]).to.not.be.empty;

                var notes = [NoteMock.get(), NoteMock.get()];
                _.first(notes)[attr1] = !value1;
                _.last(notes)[attr1] = value1;

                _.first(notes)[attr2].push(value2)
                _.last(notes)[attr2].push('teste');

                var filteredNotes = SearchService.filter(notes);
                expect(filteredNotes.length).to.not.be.equal(notes.length);
                expect(filteredNotes).to.be.empty;
            });

        });
    });
})();
