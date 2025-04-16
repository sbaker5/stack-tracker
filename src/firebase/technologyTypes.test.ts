import {
  addTechnologyType,
  updateTechnologyType,
  deleteTechnologyType,
  getAllTechnologyTypes
} from './technologyTypes';

// Mock Firebase dependencies
jest.mock('./config', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-user' } },
}));

// Mock Firestore functions
const mockAdd = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockGet = jest.fn();

const mockSetDoc = jest.fn();
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: (...args: any[]) => mockAdd(...args),
  setDoc: (...args: any[]) => mockSetDoc(...args),
  updateDoc: (...args: any[]) => mockUpdate(...args),
  deleteDoc: (...args: any[]) => mockDelete(...args),
  getDocs: (...args: any[]) => mockGet(...args),
  doc: jest.fn(() => ({ id: 'abc123' })),
  query: jest.fn(),
  where: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

describe('technologyTypes API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('addTechnologyType returns id on success', async () => {
    mockSetDoc.mockResolvedValue({});
    const res = await addTechnologyType({ name: 'Test', value: 'test', icon: 'code', description: '' });
    expect(res).toMatchObject({ id: 'abc123', error: null });
  });

  it('addTechnologyType returns error on failure', async () => {
    mockSetDoc.mockRejectedValue(new Error('fail'));
    const res = await addTechnologyType({ name: 'Test', value: 'test', icon: 'code', description: '' });
    expect(res.error).toBeTruthy();
  });

  it('updateTechnologyType returns success true', async () => {
    mockUpdate.mockResolvedValue({});
    const res = await updateTechnologyType('id', { name: 'Test' });
    expect(res).toMatchObject({ success: true });
  });

  it('updateTechnologyType returns error on failure', async () => {
    mockUpdate.mockRejectedValue(new Error('fail'));
    const res = await updateTechnologyType('id', { name: 'Test' });
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('deleteTechnologyType returns success true', async () => {
    mockDelete.mockResolvedValue({});
    const res = await deleteTechnologyType('id');
    expect(res).toMatchObject({ success: true });
  });

  it('deleteTechnologyType returns error on failure', async () => {
    mockDelete.mockRejectedValue(new Error('fail'));
    const res = await deleteTechnologyType('id');
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it('getAllTechnologyTypes returns array on success', async () => {
    mockGet.mockResolvedValue({ docs: [{ id: '1', data: () => ({ name: 'A' }) }] });
    const res = await getAllTechnologyTypes();
    expect(Array.isArray(res.techTypes)).toBe(true);
    expect(res.techTypes[0].id).toBe('1');
    expect(res.error).toBeNull();
  });

  it('getAllTechnologyTypes returns empty array on error', async () => {
    mockGet.mockRejectedValue(new Error('fail'));
    const res = await getAllTechnologyTypes();
    expect(res.techTypes).toEqual([]);
    expect(res.error).toBeTruthy();
  });
});
