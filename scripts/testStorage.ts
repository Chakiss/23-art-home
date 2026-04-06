import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../src/lib/firebase';

/**
 * Test Firebase Storage connection
 */
async function testStorageConnection() {
  console.log('🔥 Testing Firebase Storage connection...');
  
  try {
    // Create a test text file
    const testContent = new Blob(['Hello Firebase Storage! Test at ' + new Date().toISOString()], { 
      type: 'text/plain' 
    });
    
    // Create a reference to the file
    const testRef = ref(storage, 'test/connection-test.txt');
    
    console.log('📤 Uploading test file...');
    const snapshot = await uploadBytes(testRef, testContent);
    
    console.log('📄 File uploaded successfully');
    console.log('Snapshot:', snapshot);
    
    console.log('🔗 Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ SUCCESS! Storage is working!');
    console.log('📁 Bucket:', snapshot.ref.bucket);
    console.log('📍 Full path:', snapshot.ref.fullPath);
    console.log('🔗 Download URL:', downloadURL);
    
    return {
      success: true,
      bucket: snapshot.ref.bucket,
      downloadURL: downloadURL
    };
    
  } catch (error: any) {
    console.error('❌ Storage test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

testStorageConnection()
  .then((result) => {
    if (result.success) {
      console.log('🎉 Storage test completed successfully!');
      process.exit(0);
    } else {
      console.log('💥 Storage test failed');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });