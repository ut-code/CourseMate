import { Link } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

interface Props {
  name: string;
  imageUri: string;
  children?: React.ReactNode;
}

/**
 * リストの項目
 * @param props.name ユーザ名
 * @param props.imageUri 画像のURI
 * @param props.children 内部に配置する要素
 * @returns リストの項目
 */
const ListItem = (props: Props) => {
  const { name, imageUri, children } = props;
  const image = { uri: imageUri };

  return (
    <Link to={{ screen: "Profile" }}>
      <TouchableOpacity style={styles.followerListItem}>
        <View>
          <Image source={image} style={styles.followerListItemImage} />
          <Text style={styles.followerListItemTitle}>{name}</Text>
        </View>
        {children}
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  followerListItem: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
  },
  followerListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  followerListItemImage: {
    width: 40,
    height: 40,
  },
});

export default ListItem;
