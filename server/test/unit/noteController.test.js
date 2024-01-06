import * as chai from 'chai'
import sinon from 'sinon';
import { createNote, fetchNotes, getNoteById, updateNode, deleteNote, searchNote, shareNote } from '../../controllers/noteController.js'
import Notes from '../../models/noteModel.js';
import Users from '../../models/userModel.js';

const { expect } = chai;

describe('Note Controllers', () => {
    afterEach(() => {
        sinon.restore();
    });

    //create note
    it('should create a new note', async () => {
        const req = { body: { title: 'Test Note', content: 'This is a test note.' }, user: { _id: 'test123' } };
        const res = { status: sinon.stub(), json: sinon.stub() };

        const fakeNote = { _id: 'note123', title: 'Test Note', content: 'This is a test note.', owner: req.user._id };
        sinon.stub(Notes, 'create').resolves(fakeNote);

        await createNote(req, res);

        expect(res.json).to.have.been.calledWith(fakeNote);
    });


    //fetch notes
    it('should fetch all notes for the authenticated user', async () => {
        const req = { user: { _id: 'test123' } };
        const res = { status: sinon.stub(), json: sinon.stub() };

        const fakeNotes = [
            { _id: 'note1', title: 'Note 1', content: 'Content 1', owner: req.user._id },
            { _id: 'note2', title: 'Note 2', content: 'Content 2', owner: req.user._id },
        ];

        sinon.stub(Notes, 'find').withArgs({ owner: req.user._id }).resolves(fakeNotes);

        await fetchNotes(req, res);

        expect(res.json).to.have.been.calledWith(fakeNotes);

    });


    //get note by id
    it('Should fetch a note by ID for the authenticate user', async () => {
        const req = { params: { id: 'note123' }, user: { _id: 'test123' } }
        const res = { status: sinon.stub(), json: sinon.stub() }

        const fakeNote = { _id: 'note123', title: 'Test Note', content: 'Test content', owner: req.user._id }

        sinon.stub(Notes, 'findOne').withArgs({ _id: req.params.id, owner: req.user._id }).resolves(fakeNote)

        await getNoteById(req, res)

        expect(res.json.calledWithExactly(fakeNote)).to.be.true
    })


    //update note
    it('should update a note by ID for the authenticated user', async () => {
        const req = { params: { id: 'note123' }, body: { title: 'Updated Title', content: 'Updated Content' }, user: { _id: 'test123' } };
        const res = { status: sinon.stub(), json: sinon.stub() };

        const fakeUpdatedNote = { _id: 'note123', title: 'Updated Title', content: 'Updated Content', owner: req.user._id };

        sinon.stub(Notes, 'findOneAndUpdate').withArgs(
            { _id: req.params.id, owner: req.user._id },
            { title: req.body.title, content: req.body.content },
            { new: true }
        ).resolves(fakeUpdatedNote);

        await updateNode(req, res);

        expect(res.json.calledWithExactly(fakeUpdatedNote)).to.be.true;
    });



    //delete note
    it('Should delete a note by ID for authenticate user', async () => {
        const req = { params: { id: 'note123' }, user: { _id: 'test123' } }
        const res = { status: sinon.stub(), send: sinon.stub() }

        const fakeDeleteNote = { _id: 'note123', owner: req.user._id }

        sinon.stub(Notes, 'findOneAndDelete').withArgs({ _id: req.params.id, owner: req.user._id }).resolves(fakeDeleteNote)

        await deleteNote(req, res)

        expect(res.send.calledWithExactly('Note deleted successfully')).to.be.true;

    })


    //share note
    it('should share a note with a user successfully', async () => {
        const req = { params: { id: 'note123' }, body: { toUserId: 'user456' }, user: { _id: 'user123' } };
        const res = { json: sinon.stub(), send: sinon.stub() };

        const fakeNote = { _id: 'note123', owner: req.user._id, sharedWith: [] };
        const fakeUserToShareWith = { _id: 'user456' };

        sinon.stub(Notes, 'findOne').withArgs({ _id: req.params.id, owner: req.user._id }).resolves(fakeNote);
        sinon.stub(Users, 'findById').withArgs(req.body.toUserId).resolves(fakeUserToShareWith);

        await shareNote(req, res);

        expect(res.json.calledWithExactly({ msg: 'Note is already shared with the user' })).to.be.false;
        expect(res.send.calledWithExactly('note shared')).to.be.true;
        expect(fakeNote.sharedWith).to.include(req.body.toUserId);
    });


    //search note
    it('should search notes based on the query', async () => {
        const req = { query: { q: 'searchQuery' }, user: { _id: 'user123' } };
        const res = { status: sinon.stub(), json: sinon.stub() };

        const fakeNotes = [{ _id: 'note123', title: 'Note 1', content: 'Content 1', owner: req.user._id }];
        sinon.stub(Notes, 'find').withArgs({
            $and: [
                { $or: [{ title: { $regex: req.query.q, $options: 'i' } }, { content: { $regex: req.query.q, $options: 'i' } }] },
                { owner: req.user._id }
            ]
        }).resolves(fakeNotes);

        await searchNote(req, res);

        expect(res.json.calledWithExactly(fakeNotes)).to.be.true;
    });

})