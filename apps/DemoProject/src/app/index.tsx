import React, {useEffect} from 'react';
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {FlashList} from '@shopify/flash-list';

import {api, type RouterOutputs} from '../utils/api';

const PostCard: React.FC<{
  post: RouterOutputs['post']['all'][number];
  onDelete: () => void;
}> = ({post, onDelete}) => {
  // const router = useRouter();

  return (
    <View
      style={{
        marginBottom: 20,
        backgroundColor: 'lightgray',
      }}>
      <View>
        <TouchableOpacity
          onPress={() => {
            // router.push(`/post/${post.id}`);
          }}>
          <Text>{post.title}</Text>
          <Text>{post.content}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onDelete}
        style={{
          padding: 20,
          backgroundColor: 'crimson',
        }}>
        <Text
          style={{
            color: 'white',
          }}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CreatePost: React.FC = () => {
  const utils = api.useContext();

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  const {mutate, error} = api.post.create.useMutation({
    async onSuccess() {
      setTitle('');
      setContent('');
      await utils.post.all.invalidate();
    },
  });

  return (
    <View
      style={{
        marginBottom: 50,
      }}>
      <TextInput
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={{
          backgroundColor: 'black',
          color: 'white',
        }}
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text>{error.data.zodError.fieldErrors.title}</Text>
      )}
      <TextInput
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        style={{
          backgroundColor: 'black',
          color: 'white',
        }}
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <Text>{error.data.zodError.fieldErrors.content}</Text>
      )}
      <TouchableOpacity
        style={{
          padding: 20,
          backgroundColor: 'green',
        }}
        onPress={() => {
          mutate({
            title,
            content,
          });
        }}>
        <Text
          style={{
            color: 'white',
          }}>
          Publish post
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Index = () => {
  const utils = api.useContext();

  // useEffect(() => {
  //   async function name() {
  //     try {
  //       console.log('fetch');
  //       const req = await fetch(
  //         'http://192.168.1.14:3000',
  //         // 'http://localhost:3000/api/trpc/post.all?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%221%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D',
  //       );

  //       console.log(req.json().then(e => console.log(e)));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   name();
  // }, []);

  const postQuery = api.post.all.useQuery();

  console.log('postQuery.isLoading', postQuery.isLoading);
  console.log('postQuery.isSuccess', postQuery.isSuccess);
  console.log('postQuery.data', postQuery.data);

  const deletePostMutation = api.post.delete.useMutation({
    onSettled: () => utils.post.all.invalidate(),
  });

  return (
    <View>
      {/* Changes page title visible on the header */}
      {/* <Stack.Screen options={{title: 'Home Page'}} /> */}
      <View>
        <Text>
          Create <Text>T3</Text> Turbo
        </Text>

        <Button
          onPress={() => void utils.post.all.invalidate()}
          title="Refresh posts"
          color={'#f472b6'}
        />

        <View>
          <Text>Press on a post</Text>
        </View>

        <FlatList
          data={postQuery.data}
          renderItem={p => (
            <PostCard
              post={p.item}
              onDelete={() => deletePostMutation.mutate(p.item.id)}
            />
          )}
        />

        {/* <FlashList
            data={postQuery.data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View />}
            renderItem={p => (
              <PostCard
                post={p.item}
                onDelete={() => deletePostMutation.mutate(p.item.id)}
              />
            )}
          /> */}

        <CreatePost />
      </View>
    </View>
  );
};

export default Index;
